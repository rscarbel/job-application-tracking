import { prettifyDate } from "@/utils/global";
import prisma from "@/services/globalPrismaClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = parseInt(searchParams.get("userId"));
  const companyName = searchParams.get("companyName");
  const jobTitle = searchParams.get("jobTitle");
  const boardId = parseInt(searchParams.get("boardId"));

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

  if (!boardId || isNaN(boardId)) {
    return Response.json({
      status: 400,
      body: { error: "Invalid boardId" },
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

    const lastApplicationToJobInOtherBoard =
      await prisma.applicationCard.findFirst({
        where: {
          jobId: job.id,
          applicationBoardId: {
            not: boardId,
          },
        },
        orderBy: {
          applicationDate: "desc",
        },
        select: {
          applicationDate: true,
          applicationBoard: {
            select: {
              name: true,
            },
          },
        },
      });

    const lastApplicationToJobInThisBoard =
      await prisma.applicationCard.findFirst({
        where: {
          jobId: job.id,
          applicationBoardId: boardId,
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
        boardName: lastApplicationToJobInOtherBoard?.applicationBoard.name,
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
