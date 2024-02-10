import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { CompanySize, CompanyType } from "@prisma/client";
import { findCompanyByName } from ".";

export const updateCompanyDetails = async ({
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
  name: string;
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
  const company = await findCompanyByName({ name, userId });

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
    include: {
      details: true,
    },
  });
};
