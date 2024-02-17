import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { JobCompensationInterface } from "./JobCompensationInterface";

interface UpdateCompensationInterface extends JobCompensationInterface {
  jobId: number;
  userId: string;
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
  userId,
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
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};
