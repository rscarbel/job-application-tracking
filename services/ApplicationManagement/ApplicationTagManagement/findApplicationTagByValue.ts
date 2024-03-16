import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const findApplicationTagByValue = async ({
  value,
  userId,
  client = prisma,
}: {
  value: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.applicationTag.findUnique({
    where: {
      value_userId: {
        value,
        userId,
      },
    },
  });
};
