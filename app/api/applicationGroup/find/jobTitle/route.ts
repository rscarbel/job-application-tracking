import { prettifyDate } from "@/utils/global";
import prisma from "@/services/globalPrismaClient";
import { getRequestUser } from "@/services/userService";
import serverErrorResponse from "@/app/api/serverErrorResponse";
import { ApiRequest } from "@/utils/ApiRequestType";

export async function GET(request: ApiRequest) {
  const { searchParams } = new URL(request.url);
  const companyName = searchParams.get("companyName");
  const jobTitle = searchParams.get("jobTitle");
  const groupId = searchParams.get("groupId");

  const user = await getRequestUser(request);
  const userId = user?.id;

  if (!userId)
    return serverErrorResponse("The request user does not exist", 404);
  if (!companyName) return serverErrorResponse("Invalid companyName", 400);
  if (!jobTitle) return serverErrorResponse("Invalid jobTitle", 400);
  if (!groupId) return serverErrorResponse("Invalid groupId", 400);

  try {
    const company = await prisma.company.findFirst({
      where: {
        name: companyName,
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!company) return serverErrorResponse("Company not found", 404);

    const job = await prisma.job.findFirst({
      where: {
        title: jobTitle,
        companyId: company.id,
        userId: userId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!job) return serverErrorResponse("Job not found", 404);

    const lastApplicationToJobInOtherBoard = await prisma.application.findFirst(
      {
        where: {
          jobId: job.id,
          applicationGroupId: {
            not: parseInt(groupId),
          },
        },
        orderBy: {
          applicationDate: "desc",
        },
        select: {
          applicationDate: true,
          applicationGroup: {
            select: {
              name: true,
            },
          },
        },
      }
    );

    const lastApplicationToJobInThisBoard = await prisma.application.findFirst({
      where: {
        jobId: job.id,
        applicationGroupId: parseInt(groupId),
      },
      orderBy: {
        applicationDate: "desc",
      },
      select: {
        applicationDate: true,
      },
    });

    const payload = {
      jobTitle: jobTitle,
      lastApplicationToJobInThisBoard:
        lastApplicationToJobInThisBoard?.applicationDate,
      lastApplicationToJobInOtherBoard: {
        date: lastApplicationToJobInOtherBoard?.applicationDate,
        boardName: lastApplicationToJobInOtherBoard?.applicationGroup.name,
      },
    };

    return Response.json({
      body: payload,
    });
  } catch (error) {
    return Response.json({
      status: 404,
      body: {
        jobTitle: null,
        lastApplicationToJobInThisBoard: null,
        lastApplicationToJobInOtherBoard: null,
      },
    });
  }
}
