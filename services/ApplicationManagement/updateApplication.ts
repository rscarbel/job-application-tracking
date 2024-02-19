import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { ApplicationStatus, Application, Job } from "@prisma/client";

export const updateApplication = async ({
  application,
  applicationDate,
  applicationLink,
  job,
  positionIndex,
  status,
  tags,
  client = prisma,
}: {
  application: Application;
  applicationDate?: Date;
  applicationLink?: string;
  job?: Job;
  positionIndex?: number;
  status?: ApplicationStatus;
  tags?: string[];
  client?: TransactionClient | typeof prisma;
}) => {
  await client.application.update({
    where: {
      id: application.id,
    },
    data: {
      applicationDate,
      applicationLink,
      job: job
        ? {
            connect: {
              id: job.id,
            },
          }
        : undefined,
      positionIndex,
      status,
      tags: tags
        ? {
            set: tags,
          }
        : undefined,
    },
  });
};
