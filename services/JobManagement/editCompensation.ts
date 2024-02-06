import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { PayFrequency } from "@prisma/client";

export const editCompensation = async ({
  payAmount,
  payFrequency,
  currency,
  salaryRangeMin,
  salaryRangeMax,
  hoursWeek,
  negotiable,
  jobId,
  client = prisma,
}: {
  payAmount?: number;
  payFrequency?: PayFrequency;
  currency?: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  hoursWeek?: number;
  negotiable?: boolean;
  jobId: number;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.compensation.updateMany({
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
