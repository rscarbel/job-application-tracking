import prisma from "@/services/globalPrismaClient";
import { Company } from "@prisma/client";
import { CompanyPreferenceInterface } from "./CompanyPreferenceInterface";
import { TransactionClient } from "@/utils/databaseTypes";

export const updateCompanyPreferences = async ({
  company,
  preferences,
  client = prisma,
}: {
  company: Company;
  preferences: CompanyPreferenceInterface;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.companyPreference.update({
    where: {
      companyId: company.id,
    },
    data: {
      ...preferences,
    },
  });
};
