import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const createCompany = async ({
  name,
  userId,
  client = prisma,
}: {
  name: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.company.create({
    data: {
      name: name,
      userId: userId,
    },
  });
};
