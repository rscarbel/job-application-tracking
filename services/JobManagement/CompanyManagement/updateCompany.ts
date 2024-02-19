import prisma from "@/services/globalPrismaClient";
import { CompanyPreferenceInterface } from "./CompanyPreferenceInterface";
import { TransactionClient } from "@/utils/databaseTypes";
import { findCompanyByName } from "./findCompanyByName";
import { updateCompanyDetails } from "./updateCompanyDetails";
import { CompanyDetailsInterface } from "./CompanyDetailsInterface";
import { CompanyAddressInterface } from "./CompanyAddressInterface";
import { updateCompanyAddress } from "./updateCompanyAddress";
import { updateCompanyPreferences } from "./updateCompanyPreferences";

export const updateCompany = async ({
  name,
  userId,
  newName,
  details,
  address,
  preferences,
  client = prisma,
}: {
  name: string;
  newName?: string;
  userId: string;
  details?: CompanyDetailsInterface;
  address?: CompanyAddressInterface;
  preferences?: CompanyPreferenceInterface;
  client?: TransactionClient | typeof prisma;
}) => {
  const company = await findCompanyByName({ name, userId, client });

  if (!company) throw new Error("Company not found");

  if (details) {
    await updateCompanyDetails({
      company,
      details,
      client,
    });
  }

  if (address) {
    await updateCompanyAddress({
      company,
      address,
      client,
    });
  }

  if (preferences) {
    await updateCompanyPreferences({
      company,
      preferences,
      client,
    });
  }

  if (newName) {
    client.company.update({
      where: {
        id: company.id,
      },
      data: {
        name: newName,
      },
    });
  }

  return company;
};
