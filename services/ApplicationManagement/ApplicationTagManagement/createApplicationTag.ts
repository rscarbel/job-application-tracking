import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const createApplicationTag = async ({
  value,
  userId,
  client = prisma,
}: {
  value: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.applicationTag.create({
    data: {
      value,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};
