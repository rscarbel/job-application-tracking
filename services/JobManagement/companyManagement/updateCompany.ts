import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const updateCompany = async ({
  companyId,
  name,
  userId,
  client = prisma,
}: {
  companyId: number;
  name: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.company.update({
    where: {
      id: companyId,
    },
    data: {
      name: name,
      userId: userId,
    },
    include: {
      details: true,
    },
  });
};
