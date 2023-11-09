import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
  "postgres://postgres:@localhost:5432/application_tracking_test";

try {
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.applicationCard.deleteMany();
  await prisma.job.deleteMany();
  await prisma.jobAddress.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.companyAddress.deleteMany();
  await prisma.compensation.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.contactAddress.deleteMany();
  await prisma.contactAttribute.deleteMany();
  await prisma.email.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.oAuth.deleteMany();
} catch {
  console.error("\nThere was an error resetting your test database");
  console.log(
    "Make sure you have first created a postgres database called 'application_tracking_test' \nand then run 'bun run migrate:test' to prepare the test database\n"
  );
  process.exit(1);
}
