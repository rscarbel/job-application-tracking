import prisma from "@/services/globalPrismaClient";
import {
  TransactionClient,
  CompanyDetailInterface,
  AddressInterface,
} from "@/utils/databaseTypes";

/**
 * Finds or creates a company with the given details.
 * @param {string} companyName - The name of the company.
 * @param {string} userId - The ID of the user associated with the company.
 * @param {AddressInterface} addressProperties - The properties for the company's address.
 * @param {CompanyDetailInterface} companyDetailsProperties - The properties for the company's details.
 * @param {typeof prisma} client - Prisma client instance, defaults to global instance.
 * @returns The found or created company.
 */
export const findOrCreateCompany = async ({
  companyName,
  userId,
  addressProperties,
  companyDetailsProperties,
  client = prisma,
}: {
  companyName: string;
  userId: string;
  addressProperties: AddressInterface;
  companyDetailsProperties: CompanyDetailInterface;
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

  const newAddress = await client.address.create({
    data: { ...addressProperties },
  });

  const newCompanyDetails = await client.companyDetail.create({
    data: { ...companyDetailsProperties },
  });

  return await client.company.create({
    data: {
      name: companyName,
      user: {
        connect: {
          id: userId,
        },
      },
      addresses: {
        connect: {
          id: newAddress.id,
        },
      },
      details: {
        connect: {
          id: newCompanyDetails.id,
        },
      },
    },
  });
};

/**
 * Updates the details and address of an existing company.
 * @param {number} companyId - The ID of the company to update.
 * @param {string} companyName - The new name of the company.
 * @param {CompanyDetailInterface} companyDetailsProperties - The new details of the company.
 * @param {AddressInterface} addressProperties - The new address of the company.
 * @param {typeof prisma} client - Prisma client instance, defaults to global instance.
 * @returns The updated company.
 */
export const updateCompany = async ({
  companyId,
  companyName,
  companyDetailsProperties = undefined,
  addressProperties = undefined,
  client = prisma,
}: {
  companyId: number;
  companyName: string;
  addressProperties?: AddressInterface;
  companyDetailsProperties?: CompanyDetailInterface;
  client?: TransactionClient | typeof prisma;
}) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }

  // Begin a transaction to ensure atomicity of operations
  const company = await client.company.findUnique({
    where: { id: companyId },
    include: { addresses: { orderBy: { fromDate: "desc" }, take: 1 } },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Address update logic
  if (addressProperties) {
    const lastAddress = company.addresses[0];

    const hasAddressChanged =
      lastAddress &&
      (lastAddress.streetAddress !== addressProperties.streetAddress ||
        lastAddress.streetAddress2 !== addressProperties.streetAddress2 ||
        lastAddress.city !== addressProperties.city ||
        lastAddress.state !== addressProperties.state ||
        lastAddress.country !== addressProperties.country ||
        lastAddress.postalCode !== addressProperties.postalCode);

    if (hasAddressChanged) {
      // Update the old address throughDate
      await client.address.update({
        where: { id: lastAddress.id },
        data: { throughDate: addressProperties.fromDate },
      });

      // Create a new address
      await client.address.create({
        data: {
          ...addressProperties,
          companyId,
        },
      });
    }
  }

  // Update company details
  await client.company.update({
    where: { id: companyId },
    data: {
      name: companyName,
      details: companyDetailsProperties
        ? { create: { ...companyDetailsProperties } }
        : {},
    },
  });

  return company;
};

/**
 * Creates or updates a company based on the presence of companyId.
 * @param {number} companyId - The ID of the company (optional).
 * @param {string} userId - The ID of the user associated with the company.
 * @param {string} companyName - The name of the company.
 * @param {CompanyDetailInterface} companyDetailsProperties - The properties for the company's details.
 * @param {AddressInterface} addressProperties - The properties for the company's address.
 * @param {typeof prisma} client - Prisma client instance, defaults to global instance.
 * @returns The created or updated company.
 */
export const createOrUpdateCompany = async ({
  companyId,
  userId,
  companyName,
  companyDetailsProperties,
  addressProperties,
  client = prisma,
}: {
  companyId?: number;
  userId: string;
  companyName: string;
  companyDetailsProperties?: CompanyDetailInterface;
  addressProperties?: AddressInterface;
  client?: TransactionClient | typeof prisma;
}) => {
  if (companyId) {
    return await updateCompany({
      companyId,
      companyDetailsProperties,
      addressProperties,
      companyName,
      client,
    });
  } else {
    return await findOrCreateCompany({
      companyName,
      userId,
      client,
      addressProperties: addressProperties,
      companyDetailsProperties,
    });
  }
};
