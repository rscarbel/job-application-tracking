import prisma from "@/services/globalPrismaClient";
import { CompanyDetailInterface, AddressInterface } from "@/utils/types";


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
  client?: typeof prisma;
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
 * @param {AddressInterface} companyAddressProperties - The new address of the company.
 * @param {typeof prisma} client - Prisma client instance, defaults to global instance.
 * @returns The updated company.
 */
export const updateCompany = async ({
  companyId,
  companyName,
  companyDetailsProperties = undefined,
  companyAddressProperties = undefined,
  client = prisma,
}: {
  companyId: number;
  companyName: string;
  companyDetailsProperties?: CompanyDetailInterface;
  companyAddressProperties?: AddressInterface;
  client?: typeof prisma;
}) => {
  if (!companyId) {
    throw new Error("companyId is required");
  }

  const company = await client.company.findFirst({
    where: {
      id: companyId,
    },
    include: {
      addresses: {
        orderBy: {
          fromDate: 'desc',
        },
        take: 1,
      },
      details: true,
    },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  let updateAddresses = {};

  if (companyAddressProperties) {
    const lastAddress = company.addresses[0];

    const isDifferentAddress = !lastAddress || Object.entries(companyAddressProperties).some(([key, value]) => {
      return lastAddress[key] !== value;
    });

    if (isDifferentAddress) {
      if (lastAddress) {
        await client.address.update({
          where: {
            id: lastAddress.id,
          },
          data: {
            throughDate: companyAddressProperties.fromDate,
          },
        });
      }

      updateAddresses = {
        create: {
          ...companyAddressProperties,
        },
      };
    }
  }

  return await client.company.update({
    where: {
      id: companyId,
    },
    data: {
      name: companyName,
      addresses: updateAddresses,
      details: companyDetailsProperties ? {
        create: {
          ...companyDetailsProperties,
        },
      } : {},
    },
  });
};


/**
 * Creates or updates a company based on the presence of companyId.
 * @param {number} companyId - The ID of the company (optional).
 * @param {string} userId - The ID of the user associated with the company.
 * @param {string} companyName - The name of the company.
 * @param {CompanyDetailInterface} companyDetailsProperties - The properties for the company's details.
 * @param {AddressInterface} companyAddressProperties - The properties for the company's address.
 * @param {typeof prisma} client - Prisma client instance, defaults to global instance.
 * @returns The created or updated company.
 */
export const createOrUpdateCompany = async ({
  companyId,
  userId,
  companyName,
  companyDetailsProperties,
  companyAddressProperties,
  client = prisma,
}: {
  companyId?: number;
  userId: string;
  companyName: string;
  companyDetailsProperties?: CompanyDetailInterface;
  companyAddressProperties?: AddressInterface;
  client?: typeof prisma;
}) => {
  if (companyId) {
    return await updateCompany({
      companyId,
      companyName,
      client,
    });
  } else {
    return await findOrCreateCompany({
      companyName,
      userId,
      client,
      addressProperties: companyAddressProperties,
      companyDetailsProperties,
    });
  }
};
