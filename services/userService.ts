import prisma from "@/services/globalPrismaClient";
import { getToken } from "next-auth/jwt";
import { User } from "@prisma/client";
import { NextApiRequest } from "next";

export const getRequestUser = async (
  request: NextApiRequest
): Promise<User | null> => {
  const token = await getToken({ req: request });
  const { sub, provider } = token || { sub: null, provider: null };
  if (!sub || typeof provider !== "string") return null;

  const authRecord = await prisma.oAuth.findUnique({
    where: {
      provider_externalId: {
        provider: provider,
        externalId: sub,
      },
    },
    include: {
      user: true,
    },
  });

  if (!authRecord) return null;

  return authRecord.user;
};
