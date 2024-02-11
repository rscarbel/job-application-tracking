import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { Job } from "@prisma/client";
import { JobAddressInterface } from "./JobAddressInterface";

export const updateJobAddress = async ({
  job,
  address,
  client = prisma,
}: {
  job: Job;
  address: JobAddressInterface;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.jobAddress.update({
    where: {
      jobId: job.id,
    },
    data: {
      ...address,
    },
  });
};
