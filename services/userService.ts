import prisma from "@/services/globalPrismaClient";
import { getToken } from "next-auth/jwt";
import { User } from "@prisma/client";
import { ApiRequest } from "@/utils/ApiRequestType";

export const getRequestUser = async (
  request: ApiRequest
): Promise<User | null> => {
  const token = await getToken({ req: request });

  const { sub, provider } = token || { sub: null, provider: null };
  if (!sub || typeof provider !== "string") return null;

  if (provider === "credentials") {
    const user = await prisma.user.findUnique({
      where: {
        email: token.email,
      },
    });

    return user;
  }

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
