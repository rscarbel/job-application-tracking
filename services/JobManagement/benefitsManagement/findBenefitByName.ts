import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";

export const findBenefitByName = async ({
  benefitName,
  userId,
  client = prisma,
}: {
  benefitName: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.benefit.findUnique({
    where: {
      name_userId: {
        name: benefitName,
        userId: userId,
      },
    },
  });
};
