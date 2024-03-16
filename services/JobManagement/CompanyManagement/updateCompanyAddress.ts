import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { Company } from "@prisma/client";
import { CompanyAddressInterface } from "./CompanyAddressInterface";

export const updateCompanyAddress = async ({
  company,
  address,
  client = prisma,
}: {
  company: Company;
  address: CompanyAddressInterface;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.companyAddress.update({
    where: {
      companyId: company.id,
    },
    data: {
      ...address,
    },
  });
};
