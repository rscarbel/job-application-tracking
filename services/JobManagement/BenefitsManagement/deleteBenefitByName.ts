import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { findBenefitByName } from "./findBenefitByName";

export const deleteBenefitByName = async ({
  benefitName,
  userId,
  client = prisma,
}: {
  benefitName: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const benefit = await findBenefitByName({ benefitName, userId, client });

  if (!benefit) return null;

  client.benefit.delete({
    where: {
      name_userId: {
        name: benefitName,
        userId: userId,
      },
    },
  });
};
