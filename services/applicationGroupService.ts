import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/types";

export const createApplicationBoard = async ({
  name,
  userId,
  client = prisma,
}: {
  name: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const applicationGroup = await client.applicationGroup.create({
    data: {
      name,
      userId,
    },
  });
};

export const findApplicationBoardByName = async ({
  name,
  userId,
  client = prisma,
}: {
  name: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const applicationGroup = await client.applicationGroup.findFirst({
    where: {
      name,
      userId,
    },
  });

  return applicationGroup;
};

export const allBoardNames = async ({
  userId,
  client = prisma,
}: {
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const boards = await client.applicationGroup.findMany({
    where: {
      userId,
    },
    select: {
      name: true,
    },
  });

  return boards;
};

export const getLatestBoard = async ({
  userId,
  client = prisma,
}: {
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const board = await client.applicationGroup.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return board;
};
