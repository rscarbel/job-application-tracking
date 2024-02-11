import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { WorkMode, Company } from "@prisma/client";
import { findCompanyByName } from "./companyManagement";

interface JobInterface {
  title: string;
  company: Company;
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

/**
 *
 * @usage Pass in a job title, company, user ID,
 * and work mode to find a job.
 *
 * @options includeAddress, includeCompensation,
 * includeBenefits are all booleans to include the
 * address, compensation, and benefits in the query.
 */
export const findJob = async ({
  title,
  userId,
  company,
  workMode,
  includeAddress = false,
  includeCompensation = false,
  includeBenefits = false,
  client = prisma,
}: JobInterface) => {
  const itemsToInclude: IncludesInterface = {
    compensation: includeCompensation,
    address: includeAddress,
    benefits: includeBenefits,
  };

  return await client.job.findUnique({
    where: {
      title_companyId_userId_workMode: {
        title,
        companyId: company.id,
        userId,
        workMode,
      },
    },
    include: itemsToInclude,
  });
};
