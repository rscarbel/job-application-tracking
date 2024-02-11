import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { Company, WorkMode } from "@prisma/client";
import { updateCompensation } from "./updateCompensation";
import { JobAddressInterface } from "./JobAddressInterface";
import { JobCompensationInterface } from "./JobCompensationInterface";
import { findJob } from "./findJob";
import { updateJobAddress } from "./updateJobAddress";
import { addBenefitToJob } from "./benefitsManagement";

export const updateJob = async ({
  title,
  userId,
  company,
  workMode = WorkMode.remote,
  newTitle,
  newWorkMode,
  responsibilities = [],
  benefits,
  compensation,
  address,
  client = prisma,
}: {
  title: string;
  newTitle?: string;
  userId: string;
  company: Company;
  workMode: WorkMode;
  newWorkMode?: WorkMode;
  responsibilities?: string[];
  benefits?: string[];
  compensation?: JobCompensationInterface;
  address?: JobAddressInterface;
  client?: TransactionClient | typeof prisma;
}) => {
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

  if (benefits) {
    for (const benefitName of benefits) {
      await addBenefitToJob({
        jobId: job.id,
        benefitName,
        userId,
        client,
      });
    }
  }

  if (responsibilities.length) {
    const existingResponsibilities = job.responsibilities;

    const responsibilitiesToAdd = responsibilities.filter(
      (responsibility) => !existingResponsibilities.includes(responsibility)
    );

    if (responsibilitiesToAdd.length) {
      await client.job.update({
        where: {
          id: job.id,
        },
        data: {
          responsibilities: {
            set: [...existingResponsibilities, ...responsibilitiesToAdd],
          },
        },
      });
    }
  }

  if (newTitle || newWorkMode) {
    await client.job.update({
      where: {
        id: job.id,
      },
      data: {
        title: newTitle,
        workMode: newWorkMode,
      },
    });
  }

  return job;
};
