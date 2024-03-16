import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { findApplicationTagByValue } from "./findApplicationTagByValue";

export const deleteApplicationTagByValue = async ({
  value,
  userId,
  client = prisma,
}: {
  value: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const applicationTag = await findApplicationTagByValue({
    value,
    userId,
    client,
  });

  if (!applicationTag) return null;

  client.applicationTag.delete({
    where: {
      value_userId: {
        value,
        userId,
      },
    },
  });
};
