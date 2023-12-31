import { prettifyDate } from "@/utils/global";
import prisma from "@/services/globalPrismaClient";
import { getRequestUser } from "@/services/userService";
import { getToken } from "next-auth/jwt";
import unauthenticatedResponse from "@/app/api/unauthenticatedResponse";
import serverErrorResponse from "@/app/api/serverErrorResponse";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const companyName = searchParams.get("companyName");
  const jobTitle = searchParams.get("jobTitle");
  const groupId = parseInt(searchParams.get("groupId"));

  const token = await getToken({ req: request });
  const { sub, provider } = token || { sub: null, provider: null };
  if (!sub || typeof provider !== "string") return unauthenticatedResponse;

  const user = await getRequestUser({ sub, provider });
  const userId = user.id;

  if (!userId || isNaN(userId)) {
    return Response.json({
      status: 400,
      body: { error: "Invalid userId" },
    });
  }

  if (!companyName) {
    return Response.json({
      status: 400,
      body: { error: "Invalid userId" },
    });
  }

  if (!jobTitle) {
    return Response.json({
      status: 400,
      body: { error: "Invalid jobTitle" },
    });
  }

  if (!groupId || isNaN(groupId)) {
    return Response.json({
      status: 400,
      body: { error: "Invalid groupId" },
    });
  }
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

    const lastApplicationToJobInOtherBoard = await prisma.application.findFirst(
      {
        where: {
          jobId: job.id,
          applicationGroupId: {
            not: groupId,
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
        applicationGroupId: groupId,
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
      lastApplicationToJobInThisBoard: prettifyDate(
        lastApplicationToJobInThisBoard?.applicationDate
      ),
      lastApplicationToJobInOtherBoard: {
        date: prettifyDate(lastApplicationToJobInOtherBoard?.applicationDate),
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
