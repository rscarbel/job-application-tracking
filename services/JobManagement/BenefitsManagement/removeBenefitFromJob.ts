import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { findBenefitByName } from "./findBenefitByName";

export const removeBenefitFromJob = async ({
  benefitName,
  userId,
  jobId,
  client = prisma,
}: {
  benefitName: string;
  userId: string;
  jobId: number;
  client?: TransactionClient | typeof prisma;
}) => {
  const benefit = await findBenefitByName({ benefitName, userId, client });

  if (!benefit) return;

  client.jobBenefit.delete({
    where: {
      jobId_benefitId: {
        benefitId: benefit.id,
        jobId: jobId,
      },
    },
  });
};
