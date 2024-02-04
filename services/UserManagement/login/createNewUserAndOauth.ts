import prisma from "@/services/globalPrismaClient";
import { User, OAuthAccount } from "./interfaces";

export const createNewUserAndOauth = async (
  email: string,
  newUserInformation: User,
  account: OAuthAccount
) =>
  await prisma.user.create({
    data: {
      email: email,
      firstName: newUserInformation.firstName,
      lastName: newUserInformation.lastName,
      imageURL: newUserInformation.imageUrl,
      oAuth: {
        create: {
          provider: account.provider,
          externalId: account.providerAccountId,
        },
      },
    },
    include: {
      oAuth: true,
    },
  });
