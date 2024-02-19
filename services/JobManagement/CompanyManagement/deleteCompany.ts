import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const deleteCompany = async ({
  name,
  userId,
  client = prisma,
}: {
  name: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.company.delete({
    where: {
      name_userId: {
        name,
        userId,
      },
    },
  });
};
