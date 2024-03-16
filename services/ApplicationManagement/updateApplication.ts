import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { addTagToApplication } from "./ApplicationTagManagement/addTagToApplication";
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
  if (tags) {
    for (const tag of tags) {
      await addTagToApplication({
        userId: application.userId,
        applicationId: application.id,
        value: tag,
        client,
      });
    }
  }

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
    },
  });
};
