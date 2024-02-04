import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import type { OAuthConfig } from "next-auth/providers/oauth";
import type { CredentialsConfig } from "next-auth/providers/credentials";
import { Session } from "next-auth";
import { login, findUserByEmail } from "@/services/UserManagement";

interface OAuthAccount {
  providerAccountId: string;
  provider: string;
}

interface User {
  id: string;
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
  uid: string;
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
          const user = await findUserByEmail("user1@example.com");

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
    async signIn({ user, account }: { user: User; account: OAuthAccount }) {
      return await login({ user, account });
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
    async session({ session }: { session: Session }) {
      return session;
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: Token;
      user: User;
      account: OAuthAccount;
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
