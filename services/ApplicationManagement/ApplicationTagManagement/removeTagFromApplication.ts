import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { findApplicationTagByValue } from "./findApplicationTagByValue";

export const removeTagFromApplication = async ({
  value,
  userId,
  applicationId,
  client = prisma,
}: {
  value: string;
  userId: string;
  applicationId: number;
  client?: TransactionClient | typeof prisma;
}) => {
  const applicationTag = await findApplicationTagByValue({
    value,
    userId,
    client,
  });

  if (!applicationTag) return;

  client.applicationApplicationTag.delete({
    where: {
      tagId_applicationId: {
        tagId: applicationTag.id,
        applicationId: applicationId,
      },
    },
  });
};
