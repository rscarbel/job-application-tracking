import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const resetDatabase = async () => {
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
};

export default resetDatabase;
