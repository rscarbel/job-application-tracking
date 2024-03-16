import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { createApplicationTag } from "./createApplicationTag";
import { findApplicationTagByValue } from "./findApplicationTagByValue";

export const addTagToApplication = async ({
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
  let applicationTag = await findApplicationTagByValue({
    value,
    userId,
    client,
  });

  if (!applicationTag) {
    applicationTag = await createApplicationTag({
      value,
      userId,
      client,
    });
  }

  const existingApplicationApplicationTag =
    await client.applicationApplicationTag.findUnique({
      where: {
        tagId_applicationId: {
          applicationId,
          tagId: applicationTag.id,
        },
      },
    });

  if (existingApplicationApplicationTag)
    return existingApplicationApplicationTag;

  return client.applicationApplicationTag.create({
    data: {
      applicationId,
      tagId: applicationTag.id,
    },
  });
};
