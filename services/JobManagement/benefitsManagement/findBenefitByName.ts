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
  return client.benefit.findFirst({
    where: {
      name: benefitName,
      userId: userId,
    },
  });
};
