import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { CompanySize, CompanyType } from "@prisma/client";

export const createCompany = async ({
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
  return client.company.create({
    data: {
      name,
      userId,
      details: {
        create: {
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