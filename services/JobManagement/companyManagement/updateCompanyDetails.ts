import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { CompanySize, CompanyType } from "@prisma/client";
import { findCompanyByName } from ".";

export const updateCompanyDetails = async ({
  companyId,
  name,
  userId,
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
  companyId?: number;
  name?: string;
  userId: string;
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
  if (!companyId && !name) {
    throw new Error("companyId or name must be provided");
  }

  let company;

  if (name) {
    company = await findCompanyByName({ name, userId });
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

  return client.company.update({
    where: {
      id: company.id,
    },
    data: {
      details: {
        update: {
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
      },
    },
  });
};
