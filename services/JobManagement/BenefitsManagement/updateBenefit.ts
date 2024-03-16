import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { findBenefitByName } from "./findBenefitByName";

export const updateBenefit = async ({
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
  const isNewNameEmpty = newName === undefined || newName === null;

  if (isNewNameEmpty || newName === name) {
    return findBenefitByName({ benefitName: name, userId, client });
  }

  return client.benefit.update({
    where: {
      name_userId: {
        name: name,
        userId: userId,
      },
    },
    data: {
      name: newName,
    },
  });
};
