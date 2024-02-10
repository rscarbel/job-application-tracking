import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { createBenefit } from ".";
import { findBenefitByName } from "./findBenefitByName";

export const addBenefitToJob = async ({
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
  let benefit = await findBenefitByName({ benefitName, userId, client });

  if (!benefit) {
    benefit = await createBenefit({ name: benefitName, userId, client });
  }

  return client.jobBenefit.create({
    data: {
      jobId,
      benefitId: benefit.id,
    },
  });
};