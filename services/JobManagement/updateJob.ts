import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { editCompensation } from "./editCompensation";
import { WorkMode } from "@prisma/client";
import { JobAddressInterface } from "./JobAddressInterface";
import { JobCompensationInterface } from "./JobCompensationInterface";
import { findCompanyByName } from "./companyManagement";
import { findJob } from "./findJob";

interface JobInterface {
  title: string;
  newTitle?: string;
  companyName: string;
  responsibilities?: string[];
  benefits?: string[];
  description?: string;
  userId: string;
  workMode: WorkMode;
  newWorkMode?: WorkMode;
  compensation?: JobCompensationInterface;
  address?: JobAddressInterface;
  client?: TransactionClient | typeof prisma;
}

export const updateJob = async ({
  title,
  userId,
  companyName,
  newTitle,
  responsibilities,
  description,
  newWorkMode,
  benefits,
  compensation,
  address,
  workMode,
  client = prisma,
}: JobInterface) => {
  const company = await findCompanyByName({ name: companyName, userId });

  if (!company) {
    throw new Error("Company not found");
  }

  const job = await findJob({
    title,
    companyName,
    company,
    userId,
    workMode,
  });

  if (!job) {
    throw new Error("Job not found");
  }

  if (compensation) {
    const updatedJob = await editCompensation({
      jobId: job.id,
      ...compensation,
      client,
    });
  }

  if (address) {
    const updatedJob = await client.job.update({
      where: {
        id: job.id,
      },
      data: {
        address: {
          update: {
            ...address,
          },
        },
      },
    });
  }

  return job;
};
