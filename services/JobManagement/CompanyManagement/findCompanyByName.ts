import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const findCompanyByName = async ({
  name,
  userId,
  client = prisma,
}: {
  name: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.company.findUnique({
    where: {
      name_userId: {
        name,
        userId,
      },
    },
  });
};
