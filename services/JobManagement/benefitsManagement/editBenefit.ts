import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const editBenefit = async ({
  name,
  newName,
  userId,
  client = prisma,
}: {
  name: string;
  newName: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.benefit.updateMany({
    where: {
      name: name,
      userId: userId,
    },
    data: {
      name: newName,
    },
  });
};
