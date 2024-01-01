import prisma from "@/services/globalPrismaClient";
import { prettifyDate } from "@/utils/global";
import { ApplicationStatus, WorkMode, PayFrequency } from "@prisma/client";

const defaultAddress = {
  streetAddress: "",
  streetAddress2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

export const getFormattedCardData = async ({
  applicationCardId,
  userId,
  client = prisma,
}: {
  applicationCardId: number;
  userId: string;
  client?: typeof prisma;
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
          addresses: true,
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

  const job = applicationCard.job;
  const compensation = job.compensation;
  const lastAddress = job.addresses[job.addresses.length - 1] || defaultAddress;

  return {
    cardId: applicationCard.id,
    boardId: applicationCard.applicationBoardId,
    jobId: job.id,
    company: {
      companyId: job.company.id,
      name: job.company.name,
    },
    jobTitle: job.title,
    jobDescription: job.description,
    workMode: job.workMode,
    payAmount: compensation.payAmount,
    payFrequency: compensation.payFrequency,
    currency: compensation.currency,
    streetAddress: lastAddress.streetAddress,
    streetAddress2: lastAddress.streetAddress2,
    city: lastAddress.city,
    state: lastAddress.state,
    country: lastAddress.country,
    postalCode: lastAddress.postalCode,
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
          addresses: true,
        },
      },
    },
    orderBy: {
      positionIndex: "asc",
    },
  });


  return applicationCards.map((card) => {
    const job = card.job;
    const compensation = job.compensation;
    const lastAddress = job.addresses[job.addresses.length - 1] || defaultAddress;
  
    return {
    cardId: card.id,
    companyName: job.company.name,
    title: job.title,
    workMode: job.workMode,
    payAmount: compensation.payAmount,
    payFrequency: compensation.payFrequency,
    currency: compensation.currency,
    city: lastAddress.city,
    country: lastAddress.country,
    applicationLink: card.applicationLink,
    applicationDate: prettifyDate(card.applicationDate),
    status: card.status,
  }});
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
