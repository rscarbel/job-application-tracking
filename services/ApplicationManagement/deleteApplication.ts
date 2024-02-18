import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { Application } from "@prisma/client";

export const deleteApplication = async ({
  application,
  userId,
  client = prisma,
}: {
  application: Application;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.application.delete({
    where: {
      id: application.id,
      userId,
    },
  });
};
