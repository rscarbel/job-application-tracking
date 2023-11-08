import prisma from "@/services/globalPrismaClient";

export const getRequestUser = async ({
  sub,
  provider,
  client = prisma,
}: {
  sub: string;
  provider: string;
  client: typeof prisma;
}) => {
  if (!sub || !provider) return null;

  const authRecord = await client.oAuth.findUnique({
    where: {
      provider_externalId: {
        provider: provider as string,
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
