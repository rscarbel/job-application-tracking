import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/types";

export const getRequestUser = async ({
  sub,
  provider,
  client = prisma,
}: {
  sub: string;
  provider: string;
  client?: TransactionClient | typeof prisma;
}) => {
  if (!sub || !provider) return null;

  const authRecord = await client.oAuth.findUnique({
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

  if (!authRecord) {
    throw new Error("User not found");
  }

  return authRecord.user;
};
