import { TransactionClient } from "@/utils/databaseTypes";
import prisma from "@/services/globalPrismaClient";
import {
  WorkMode,
  PayFrequency,
  CompanySize,
  CompanyType,
} from "@prisma/client";

export enum JobSortFieldEnum {
  createdAt = "createdAt",
  title = "title",
  pay = "pay",
  workMode = "workMode",
  companyName = "companyName",
  companySize = "companySize",
}

interface SortInterface {
  field: JobSortFieldEnum;
  order: "asc" | "desc";
}

interface IncludesInterface {
  compensation?: boolean;
  address?: boolean;
  benefits?: boolean;
  company?: boolean;
}

interface LocationInterface {
  cities?: string[];
  states?: string[];
  countries?: string[];
}

interface FilterInterface {
  companies?: string[];
  excludeCompanies?: string[];
  companySizes?: CompanySize[];
  excludeCompanySizes?: CompanySize[];
  companyTypes?: CompanyType[];
  excludeCompanyTypes?: CompanyType[];
  workModes?: WorkMode[];
  excludeWorkModes?: WorkMode[];
  benefits?: string[];
  excludeBenefits?: string[];
  payMinimum?: number;
  payMaximum?: number;
  payFrequencies?: PayFrequency[];
  excludePayFrequencies?: PayFrequency[];
  currencies?: string[];
  excludeCurrencies?: string[];
  locations?: LocationInterface;
  excludeLocations?: LocationInterface;
  createdAt?: Date;
}

interface SelectInterface {
  id?: boolean;
  title?: boolean;
  workMode?: boolean;
  responsibilities?: boolean;
  description?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
}

interface PaginationInterface {
  offset: number;
  limit: number;
}

export interface ManyJobsInterface {
  userId: string;
  include?: IncludesInterface;
  filters?: FilterInterface;
  pagination?: PaginationInterface;
  select?: SelectInterface;
  sort?: SortInterface;
  client?: TransactionClient | typeof prisma;
}
