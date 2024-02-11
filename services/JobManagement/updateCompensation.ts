import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { PayFrequency } from "@prisma/client";
import { JobCompensationInterface } from "./JobCompensationInterface";

interface UpdateCompensationInterface extends JobCompensationInterface {
  jobId: number;
  client?: TransactionClient | typeof prisma;
}

export const updateCompensation = async ({
  payAmount,
  payFrequency,
  currency,
  salaryRangeMin,
  salaryRangeMax,
  hoursWeek,
  negotiable,
  jobId,
  client = prisma,
}: UpdateCompensationInterface) => {
  return client.compensation.update({
    where: {
      jobId: jobId,
    },
    data: {
      payAmount,
      payFrequency,
      currency,
      salaryRangeMin,
      salaryRangeMax,
      hoursWeek,
      negotiable,
    },
  });
};
