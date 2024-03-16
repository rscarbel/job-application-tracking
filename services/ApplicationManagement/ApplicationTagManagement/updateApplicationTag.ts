import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { findApplicationTagByValue } from "./findApplicationTagByValue";

export const updateApplicationTag = async ({
  value,
  newValue,
  userId,
  client = prisma,
}: {
  value: string;
  newValue: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const isNewNameEmpty = newValue === undefined || newValue === null;

  if (isNewNameEmpty || newValue === value) {
    const tag = findApplicationTagByValue({ value, userId, client });
    if (!tag) throw new Error(`Tag "${value}" not found`);

    return tag;
  }

  return client.applicationTag.update({
    where: {
      value_userId: {
        value,
        userId: userId,
      },
    },
    data: {
      value: newValue,
    },
  });
};
