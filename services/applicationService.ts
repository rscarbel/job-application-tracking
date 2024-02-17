import prisma from "@/services/globalPrismaClient";
import { ApplicationStatus } from "@prisma/client";
import { TransactionClient } from "@/utils/databaseTypes";
import {
  IndividualFormattedCardInterface,
  FormattedCardForBoardInterface,
} from "./FormattedCardInterface";
import { PayFrequency, WorkMode } from "@prisma/client";

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
}): Promise<IndividualFormattedCardInterface> => {
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
          address: true,
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
  const lastAddress = job.address;

  return {
    applicationId: application.id,
    groupId: application.applicationGroupId,
    jobId: job.id,
    company: {
      companyId: job.company.id,
      name: job.company.name,
    },
    jobTitle: job.title,
    jobDescription: job?.description || "",
    workMode: job.workMode,
    payAmount: compensation?.payAmount || 0,
    payFrequency: compensation?.payFrequency || PayFrequency.HOURLY,
    currency: compensation?.currency || "USD",
    streetAddress: lastAddress?.streetAddress || "",
    streetAddress2: lastAddress?.streetAddress2 || "",
    city: lastAddress?.city || "",
    state: lastAddress?.state || "",
    country: lastAddress?.country || "",
    postalCode: lastAddress?.postalCode || "",
    applicationLink: application?.applicationLink || "",
    applicationDate: application.applicationDate,
    status: application.status,
    positionIndex: application.positionIndex,
    notes: application?.notes || "",
  };
};

export const getFormattedCardsForBoard = async ({
  groupId,
  client = prisma,
}: {
  groupId: number | undefined;
  client?: TransactionClient | typeof prisma;
}): Promise<FormattedCardForBoardInterface[]> => {
  if (!groupId) {
    return [];
  }

  const applications = await client.application.findMany({
    where: {
      applicationGroupId: groupId,
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

  return applications.map((card) => {
    const job = card.job;
    const compensation = job.compensation;

    const lastAddress = job.address || defaultAddress;

    return {
      applicationId: card.id,
      groupId: card.applicationGroupId,
      companyName: job.company.name,
      title: job.title || "",
      workMode: job.workMode || WorkMode.ONSITE,
      payAmount: compensation?.payAmount || 0,
      payFrequency: compensation?.payFrequency || PayFrequency.HOURLY,
      currency: compensation?.currency || "USD",
      city: lastAddress.city || "",
      country: lastAddress.country || "",
      applicationLink: card.applicationLink || "",
      applicationDate: card.applicationDate,
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
  id,
  client = prisma,
}: {
  id: number;
  client?: TransactionClient | typeof prisma;
}) => {
  const cardToDelete = await client.application.findUnique({
    where: {
      id,
    },
    include: {
      job: true,
    },
  });

  if (!cardToDelete) {
    throw new Error("Card not found");
  }

  const job = cardToDelete.job;

  await client.application.delete({
    where: { id },
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
