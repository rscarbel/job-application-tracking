import NextAuth from "next-auth";
import options from "./options";

// NextAuth didn't like the options, but they follow the documentation to a T.
// I suspect some sort of capability mismatch between prisma and next-auth.
const handler = NextAuth(options as any);
export { handler as GET, handler as POST };
