import prisma from "@/services/globalPrismaClient";
import { prettifyDate } from "@/utils/global";
import { ApplicationStatus, WorkMode, PayFrequency } from "@prisma/client";

export const getFormattedCardData = async ({
  applicationCardId,
  userId,
  client = prisma,
}: {
  applicationCardId: number;
  userId: string;
  client: typeof prisma;
}) => {
  const applicationCard = await client.applicationCard.findUnique({
    where: {
      id: applicationCardId,
    },
    include: {
      applicationBoard: {
        include: {
          user: true,
        },
      },
      job: {
        include: {
          company: true,
          address: true,
          compensation: true,
        },
      },
    },
  });

  if (!applicationCard) {
    throw new Error("Application Card not found");
  }

  if (applicationCard.applicationBoard.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return {
    cardId: applicationCard.id,
    boardId: applicationCard.applicationBoardId,
    jobId: applicationCard.jobId,
    company: {
      companyId: applicationCard.job.company.id,
      name: applicationCard.job.company.name,
    },
    jobTitle: applicationCard.job.title,
    jobDescription: applicationCard.job.description,
    workMode: applicationCard.job.workMode,
    payAmount: applicationCard.job.compensation.payAmount,
    payFrequency: applicationCard.job.compensation.payFrequency,
    currency: applicationCard.job.compensation.currency,
    streetAddress: applicationCard.job?.address?.streetAddress,
    streetAddress2: applicationCard.job?.address?.streetAddress2,
    city: applicationCard.job?.address?.city,
    state: applicationCard.job?.address?.state,
    country: applicationCard.job?.address?.country,
    postalCode: applicationCard.job?.address?.postalCode,
    applicationLink: applicationCard.applicationLink,
    applicationDate: applicationCard.applicationDate,
    status: applicationCard.status,
    positionIndex: applicationCard.positionIndex,
    notes: applicationCard.notes,
  };
};

export const getFormattedCardsForBoard = async ({
  boardId,
  client = prisma,
}: {
  boardId: number;
  client?: typeof prisma;
}) => {
  const applicationCards = await client.applicationCard.findMany({
    where: {
      applicationBoardId: boardId,
    },
    include: {
      job: {
        include: {
          company: true,
          compensation: true,
          address: true,
        },
      },
    },
    orderBy: {
      positionIndex: "asc",
    },
  });

  return applicationCards.map((card) => ({
    cardId: card.id,
    companyName: card.job.company.name,
    title: card.job.title,
    workMode: card.job.workMode,
    payAmount: card.job.compensation.payAmount,
    payFrequency: card.job.compensation.payFrequency,
    currency: card.job.compensation.currency,
    city: card.job?.address?.city,
    country: card.job?.address?.country,
    applicationLink: card.applicationLink,
    applicationDate: prettifyDate(card.applicationDate),
    status: card.status,
  }));
};

export const incrementCardsAfterIndex = async ({
  boardId,
  status,
  index,
  client = prisma,
}: {
  boardId: number;
  status: ApplicationStatus;
  index: number;
  client?: typeof prisma;
}) => {
  await client.applicationCard.updateMany({
    where: {
      applicationBoardId: boardId,
      status: status,
      positionIndex: {
        gte: index,
      },
    },
    data: {
      positionIndex: {
        increment: 1,
      },
    },
  });
};

export const decrementCardsAfterIndex = async ({
  boardId,
  status,
  index,
  client = prisma,
}: {
  boardId: number;
  status: ApplicationStatus;
  index: number;
  client?: typeof prisma;
}) => {
  await client.applicationCard.updateMany({
    where: {
      applicationBoardId: boardId,
      status: status,
      positionIndex: {
        gte: index,
      },
    },
    data: {
      positionIndex: {
        decrement: 1,
      },
    },
  });
};

export const deleteCard = async ({
  cardId,
  client = prisma,
}: {
  cardId: number;
  client?: typeof prisma;
}) => {
  const cardToDelete = await client.applicationCard.findUnique({
    where: {
      id: cardId,
    },
    include: {
      job: true,
    },
  });

  const job = cardToDelete.job;

  if (!cardToDelete) {
    throw new Error("Card not found");
  }

  await client.applicationCard.delete({
    where: { id: cardId },
  });

  const otherApplicationsForJob = await client.applicationCard.findFirst({
    where: {
      jobId: job.id,
    },
  });

  if (!otherApplicationsForJob) {
    await client.job.delete({
      where: {
        id: job.id,
      },
    });
  }
};

export const linkJob = async (applicationCard, jobId) => {
  try {
    // Update the jobId for the applicationCard in the database
    await prisma.applicationCard.update({
      where: { id: applicationCard.id },
      data: { jobId: jobId },
    });

    // Fetch the linked Job
    const linkedJob = await prisma.job.findUnique({ where: { id: jobId } });

    if (!linkedJob) {
      throw new Error("Failed to link the job: Job not found");
    }

    return linkedJob;
  } catch (error) {
    // Log the error for debugging or monitoring purposes
    console.error(
      `Error linking job with ID ${jobId} to application card with ID ${applicationCard.id}:`,
      error.message
    );

    // Re-throw the error for the caller to handle or return a general error
    throw new Error(
      "Failed to link the job due to an internal error. Please try again later."
    );
  }
};
