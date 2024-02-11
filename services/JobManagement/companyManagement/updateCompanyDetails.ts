import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
import { Company } from "@prisma/client";
import { CompanyDetailsInterface } from "./CompanyDetailsInterface";

export const updateCompanyDetails = async ({
  company,
  details,
  client = prisma,
}: {
  company: Company;
  details: CompanyDetailsInterface;
  client?: TransactionClient | typeof prisma;
}) => {
  return client.companyDetail.update({
    where: {
      companyId: company.id,
    },
    data: {
      ...details,
    },
  });
};
