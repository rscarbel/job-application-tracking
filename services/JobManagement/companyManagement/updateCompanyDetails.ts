import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { CompanySize, CompanyType, Company } from "@prisma/client";

export const updateCompanyDetails = async ({
  company,
  culture,
  industry,
  size,
  website,
  type,
  history,
  mission,
  vision,
  values,
  description,
  client = prisma,
}: {
  company: Company;
  culture?: string;
  industry?: string;
  size?: CompanySize;
  website?: string;
  type?: CompanyType;
  history?: string;
  mission?: string;
  vision?: string;
  values?: string;
  description?: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.companyDetail.update({
    where: {
      companyId: company.id,
    },
    data: {
      culture,
      industry,
      size,
      website,
      type,
      history,
      mission,
      vision,
      values,
      description,
    },
  });
};
