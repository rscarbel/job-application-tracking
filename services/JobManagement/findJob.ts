import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { WorkMode, Company } from "@prisma/client";
import { findCompanyByName } from "./companyManagement";

interface JobInterface {
  title: string;
  companyName: string;
  company?: Company;
  userId: string;
  workMode: WorkMode;
  includeCompensation?: boolean;
  includeAddress?: boolean;
  includeBenefits?: boolean;
  client?: TransactionClient | typeof prisma;
}

interface IncludesInterface {
  compensation?: boolean;
  address?: boolean;
  benefits?: boolean;
}

export const findJob = async ({
  title,
  userId,
  companyName,
  company,
  workMode,
  includeAddress = false,
  includeCompensation = false,
  includeBenefits = false,
  client = prisma,
}: JobInterface) => {
  const jobCompany = company
    ? company
    : await findCompanyByName({ name: companyName, userId });

  if (!jobCompany) {
    throw new Error("Company not found");
  }

  const itemsToInclude: IncludesInterface = {
    compensation: includeCompensation,
    address: includeAddress,
    benefits: includeBenefits,
  };

  return await client.job.findUnique({
    where: {
      title_companyId_userId_workMode: {
        title,
        companyId: jobCompany.id,
        userId,
        workMode,
      },
    },
    include: itemsToInclude,
  });
};
