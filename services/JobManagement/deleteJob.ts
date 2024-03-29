import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { Job } from "@prisma/client";

export const deleteJob = async ({
  job,
  userId,
  client = prisma,
}: {
  job: Job;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.job.delete({
    where: {
      id: job.id,
      userId: job.userId,
    },
  });
};
