import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const createBenefit = async ({
  name,
  userId,
  client = prisma,
}: {
  name: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.benefit.create({
    data: {
      name,
      userId,
    },
  });
};
