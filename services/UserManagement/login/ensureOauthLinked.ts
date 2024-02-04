import prisma from "@/services/globalPrismaClient";
import { User } from "@prisma/client";
import { OAuthAccount } from "./interfaces";

/**
 * @description Looks for an oAuth record for the user and provider. If it doesn't exist, creates it.
 */
export const ensureOauthLinked = async (user: User, account: OAuthAccount) => {
  const isProviderLinked = prisma.oAuth.findFirst({
    where: {
      userId: user.id,
      provider: account.provider,
    },
  });

  if (!isProviderLinked) {
    await prisma.oAuth.create({
      data: {
        provider: account.provider,
        externalId: account.providerAccountId,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  return true;
};
