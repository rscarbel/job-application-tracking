import prisma from "@/services/globalPrismaClient";

export const findUserByEmail = async (email: string) =>
  (await prisma.user.findUnique({
    where: { email: email },
    include: {
      oAuth: true,
    },
  })) || null;
