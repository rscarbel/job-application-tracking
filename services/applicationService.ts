import prisma from "@/services/globalPrismaClient";
import { prettifyDate } from "@/utils/global";
import { ApplicationStatus, WorkMode, PayFrequency } from "@prisma/client";
import { TransactionClient } from "@/utils/types";

const defaultAddress = {
  streetAddress: "",
  streetAddress2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

export const getFormattedCardData = async ({
  applicationId,
  userId,
  client = prisma,
}: {
  applicationId: number;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const application = await client.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      applicationGroup: {
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

  if (!application) {
    throw new Error("Application Card not found");
  }

  if (application.applicationGroup.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const job = application.job;
  const compensation = job.compensation;
  const lastAddress = job.addresses[job.addresses.length - 1] || defaultAddress;

  return {
    applicationId: application.id,
    groupId: application.applicationGroupId,
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
    applicationLink: application.applicationLink,
    applicationDate: application.applicationDate,
    status: application.status,
    positionIndex: application.positionIndex,
    notes: application.notes,
  };
};

export const getFormattedCardsForBoard = async ({
  groupId,
  client = prisma,
}: {
  groupId: number;
  client?: TransactionClient | typeof prisma;
}) => {
  const applications = await client.application.findMany({
    where: {
      applicationGroupId: groupId,
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

  return applications.map((card) => {
    const job = card.job;
    const compensation = job.compensation;
    const lastAddress =
      job.addresses[job.addresses.length - 1] || defaultAddress;

    return {
      applicationId: card.id,
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
    };
  });
};

export const incrementCardsAfterIndex = async ({
  groupId,
  status,
  index,
  client = prisma,
}: {
  groupId: number;
  status: ApplicationStatus;
  index: number;
  client?: TransactionClient | typeof prisma;
}) => {
  await client.application.updateMany({
    where: {
      applicationGroupId: groupId,
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
  groupId,
  status,
  index,
  client = prisma,
}: {
  groupId: number;
  status: ApplicationStatus;
  index: number;
  client?: TransactionClient | typeof prisma;
}) => {
  await client.application.updateMany({
    where: {
      applicationGroupId: groupId,
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
  applicationId,
  client = prisma,
}: {
  applicationId: number;
  client?: TransactionClient | typeof prisma;
}) => {
  const cardToDelete = await client.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      job: true,
    },
  });

  const job = cardToDelete.job;

  if (!cardToDelete) {
    throw new Error("Card not found");
  }

  await client.application.delete({
    where: { id: applicationId },
  });

  const otherApplicationsForJob = await client.application.findFirst({
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

export const linkJob = async (application, jobId) => {
  try {
    // Update the jobId for the application in the database
    await prisma.application.update({
      where: { id: application.id },
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
      `Error linking job with ID ${jobId} to application card with ID ${application.id}:`,
      error.message
    );

    // Re-throw the error for the caller to handle or return a general error
    throw new Error(
      "Failed to link the job due to an internal error. Please try again later."
    );
  }
};
