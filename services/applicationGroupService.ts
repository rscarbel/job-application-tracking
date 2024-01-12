import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const createApplicationBoard = async ({
  name,
  userId,
  client = prisma,
}: {
  name: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const applicationGroup = await client.applicationGroup.create({
    data: {
      name,
      userId,
    },
  });
};
