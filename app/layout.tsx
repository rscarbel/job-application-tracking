import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession, Session } from "next-auth";
import SessionProvider from "./components/SessionProvider";
import NavMenu from "./components/NavMenu";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Application Tracker",
  description: "Track your job applications",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  const session: Session | null = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <NavMenu />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
