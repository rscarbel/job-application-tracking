import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { CompanySize, CompanyType, CompanyDesireability } from "@prisma/client";
import { CompanyDetailsInterface } from "./CompanyDetailsInterface";
import { CompanyAddressInterface } from "./CompanyAddressInterface";
import { CompanyPreferenceInterface } from "./CompanyPreferenceInterface";

const defaultCompanyDetails: CompanyDetailsInterface = {
  culture: "",
  industry: "",
  size: CompanySize.SMALL,
  website: "",
  type: CompanyType.PUBLIC,
  history: "",
  mission: "",
  vision: "",
  values: "",
  description: "",
};

const defaultCompanyAddress: CompanyAddressInterface = {
  streetAddress: "",
  streetAddress2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

const defaultCompanyPreferences: CompanyPreferenceInterface = {
  desireability: CompanyDesireability.MEDIUM,
  notes: "",
};

export const createCompany = async ({
  name,
  userId,
  details = defaultCompanyDetails,
  address = defaultCompanyAddress,
  preferences = defaultCompanyPreferences,
  client = prisma,
}: {
  name: string;
  userId: string;
  details?: CompanyDetailsInterface;
  address?: CompanyAddressInterface;
  preferences?: CompanyPreferenceInterface;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.company.create({
    data: {
      name,
      user: {
        connect: {
          id: userId,
        },
      },
      details: {
        create: details,
      },
      address: {
        create: address,
      },
      preferences: {
        create: preferences,
      },
    },
  });
};
