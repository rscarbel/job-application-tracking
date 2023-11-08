import prisma from "@/services/globalPrismaClient";

export const createApplicationBoard = async ({
  name,
  userId,
  client = prisma,
}: {
  name: string;
  userId: string;
  client?: typeof prisma;
}) => {
  const applicationBoard = await client.applicationBoard.create({
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
  client?: typeof prisma;
}) => {
  const applicationBoard = await client.applicationBoard.findFirst({
    where: {
      name,
      userId,
    },
  });

  return applicationBoard;
};

export const allBoardNames = async ({
  userId,
  client = prisma,
}: {
  userId: string;
  client?: typeof prisma;
}) => {
  const boards = await client.applicationBoard.findMany({
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
  client?: typeof prisma;
}) => {
  const board = await client.applicationBoard.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return board;
};
