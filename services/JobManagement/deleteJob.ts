import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { Job } from "@prisma/client";

export const deleteJob = async ({
  job,
  client = prisma,
}: {
  job: Job;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.job.delete({
    where: {
      id: job.id,
    },
  });
};
