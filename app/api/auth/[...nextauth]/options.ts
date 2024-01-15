import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import type { OAuthConfig } from "next-auth/providers/oauth";
import type { CredentialsConfig } from "next-auth/providers/credentials";
import prisma from "@/services/globalPrismaClient";
import { Session } from "next-auth";

interface OAuthAccount {
  providerAccountId: string;
  provider: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  oAuth: OAuthAccount[];
}

interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

interface Token {
  uid: number;
  provider: string;
}

const providers: Array<OAuthConfig<any> | CredentialsConfig<any>> = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        imageUrl: profile.picture,
      };
    },
  }),
  LinkedInProvider({
    clientId: process.env.LINKEDIN_CLIENT_ID || "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    authorization: {
      params: { scope: "openid profile email" },
    },
    issuer: "https://www.linkedin.com",
    jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
    profile(profile, tokens) {
      return {
        id: profile.sub,
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        imageUrl: profile.picture,
      };
    },
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    profile(profile) {
      return {
        id: String(profile.id),
        email: profile.email,
        firstName: profile.name.split(" ")[0],
        lastName: profile.name.split(" ").slice(1).join(" "),
        imageUrl: profile.avatar_url,
      };
    },
  }),
];

if (process.env.NODE_ENV === "development") {
  providers.push(
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === "admin" &&
          credentials.password === "admin"
        ) {
          // Fetch the user from the database
          const user = await prisma.user.findUnique({
            where: {
              email: "user1@example.com",
            },
          });

          if (user) {
            return user;
          }
        }
        return null;
      },
    })
  );
}

const options = {
  providers,
  session: { strategy: "jwt" },
  events: {
    async signIn(message: string) {},
    async signOut(message: string) {},
    async createUser(message: string) {},
    async updateUser(message: string) {},
    async linkAccount(message: string) {},
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: OAuthAccount;
      profile: Profile;
    }) {
      const email = user.email;

      if (!email) {
        return false;
      }
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: email },
          include: {
            oAuth: true,
          },
        });

        if (existingUser) {
          const isProviderLinked = existingUser.oAuth.some(
            (oAuthAccount) => oAuthAccount.provider === account.provider
          );

          if (!isProviderLinked) {
            await prisma.oAuth.create({
              data: {
                provider: account.provider,
                externalId: account.providerAccountId,
                user: {
                  connect: {
                    id: existingUser.id,
                  },
                },
              },
            });
          }

          return true;
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: email,
              firstName: user.firstName,
              lastName: user.lastName,
              imageURL: user.imageUrl,
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
        }
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
    async session({ session, user }: { session: Session; user: User }) {
      return session;
    },
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: Token;
      user: User;
      account: OAuthAccount;
      profile: Profile;
    }) {
      if (user) {
        token.uid = user.id;
        token.provider = account.provider;
      }
      return token;
    },
  },
};

export default options;
