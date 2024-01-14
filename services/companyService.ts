import prisma from "@/services/globalPrismaClient";
import { TransactionClient, AddressInterface } from "@/utils/databaseTypes";
import { CompanyDetail, CompanyPreference } from "@prisma/client";

/**
 * Finds or creates a company with the given details.
 * @param {string} companyName - The name of the company.
 * @param {string} userId - The ID of the user associated with the company.
 * @param {typeof prisma} client - Prisma client instance, defaults to global instance.
 * @returns The found or created company.
 */
export const findOrCreateCompany = async ({
  companyName,
  userId,
  client = prisma,
}: {
  companyName: string;
  userId: string;
  client?: TransactionClient | typeof prisma;
}) => {
  const company = await client.company.findFirst({
    where: {
      name: companyName,
      userId: userId,
    },
  });

  if (company) {
    return company;
  }

  return await client.company.create({
    data: {
      name: companyName,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

/**
 * Updates the details and address of an existing company.
 * @param {number} companyId - The ID of the company to update.
 * @param {string} companyName - The new name of the company.
 * @param {typeof prisma} client - Prisma client instance, defaults to global instance.
 * @returns The updated company.
 */
export const updateCompany = async ({
  companyId,
  companyName,
  client = prisma,
}: {
  companyId: number;
  companyName: string;
  client?: TransactionClient | typeof prisma;
}) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }
  const company = await client.company.findUnique({
    where: { id: companyId },
    include: { addresses: { orderBy: { fromDate: "desc" }, take: 1 } },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  await client.company.update({
    where: { id: companyId },
    data: {
      name: companyName,
    },
  });

  return company;
};
