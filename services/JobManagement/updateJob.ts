import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { Company, WorkMode } from "@prisma/client";
import { updateCompensation } from "./updateCompensation";
import { JobAddressInterface } from "./JobAddressInterface";
import { JobCompensationInterface } from "./JobCompensationInterface";
import { findJob } from "./findJob";
import { updateJobAddress } from "./updateJobAddress";

export const updateJob = async ({
  title,
  userId,
  company,
  workMode = WorkMode.remote,
  responsibilities = [],
  benefits,
  compensation,
  address,
  client = prisma,
}: {
  title: string;
  userId: string;
  company: Company;
  workMode: WorkMode;
  responsibilities?: string[];
  benefits?: string[];
  compensation?: JobCompensationInterface;
  address?: JobAddressInterface;
  client?: TransactionClient | typeof prisma;
}) => {
  if (compensation) {
    if (
      !compensation.payAmount &&
      !(compensation.salaryRangeMin && compensation.salaryRangeMax)
    ) {
      throw new Error("You must provide either a payAmount or a salaryRange");
    }
  }

  const job = await findJob({
    title,
    company,
    userId,
    workMode,
  });

  if (!job) {
    throw new Error("Job not found");
  }

  if (compensation) {
    await updateCompensation({
      jobId: job.id,
      ...compensation,
      client,
    });
  }

  if (address) {
    updateJobAddress({
      job,
      address,
      client,
    });
  }

  return job;
};
