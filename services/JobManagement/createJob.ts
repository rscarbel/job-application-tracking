import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { PayFrequency, WorkMode } from "@prisma/client";
import { findCompanyByName } from "./companyManagement";

export const createJob = async ({
  title,
  userId,
  companyId,
  companyName,
  compensation: {
    payAmount,
    payFrequency,
    currency,
    salaryRangeMin,
    salaryRangeMax,
    hoursWeek,
    negotiable,
  },
  workMode,
  client = prisma,
}: {
  title: string;
  userId: string;
  workMode: WorkMode;
  companyId?: number;
  companyName?: string;
  compensation: {
    payAmount?: number;
    payFrequency: PayFrequency;
    currency: string;
    salaryRangeMin?: number;
    salaryRangeMax?: number;
    hoursWeek?: number;
    negotiable?: boolean;
  };
  client?: TransactionClient | typeof prisma;
}) => {
  if (!companyId && !companyName) {
    throw new Error("You must provide either a companyId or a companyName");
  }

  if (companyId && companyName) {
    throw new Error(
      "You must provide either a companyId or a companyName, not both"
    );
  }

  if (!payAmount && !salaryRangeMin && !salaryRangeMax) {
    throw new Error("You must provide either a payAmount or a salaryRange");
  }

  let company;

  if (companyName) {
    company = await findCompanyByName({ name: companyName, userId });
    companyId = company?.id;
  } else {
    company = await client.company.findFirst({
      where: {
        id: companyId,
        userId,
      },
    });
  }

  if (!company) {
    throw new Error("Company not found");
  }

  return client.job.create({
    data: {
      title,
      workMode,
      company: {
        connect: {
          id: company.id,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      compensation: {
        create: {
          payAmount,
          payFrequency,
          currency,
          salaryRangeMin,
          salaryRangeMax,
          hoursWeek,
          negotiable,
        },
      },
    },
  });
};
