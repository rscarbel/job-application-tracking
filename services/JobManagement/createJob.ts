import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { Company, PayFrequency, WorkMode } from "@prisma/client";
import { JobAddressInterface } from "./JobAddressInterface";
import { JobCompensationInterface } from "./JobCompensationInterface";
import { addBenefitToJob } from "./benefitsManagement";

const defaultAddress = {
  streetAddress: "",
  streetAddress2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

const defaultCompensation = {
  payAmount: 0,
  payFrequency: PayFrequency.HOURLY,
  currency: "USD",
  salaryRangeMin: undefined,
  salaryRangeMax: undefined,
  hoursWeek: 40,
  negotiable: true,
  userId: "user123",
};

export const createJob = async ({
  title,
  userId,
  company,
  description,
  workMode = WorkMode.REMOTE,
  responsibilities = [],
  benefits,
  compensation = defaultCompensation,
  address = defaultAddress,
  client = prisma,
}: {
  title: string;
  userId: string;
  company: Company;
  workMode: WorkMode;
  description?: string;
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

  const job = await client.job.create({
    data: {
      title,
      workMode,
      responsibilities,
      description,
      company: {
        connect: {
          id: company.id,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      compensation: {
        create: { userId, ...compensation },
      },
      address: {
        create: address,
      },
    },
  });

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

  return job;
};
