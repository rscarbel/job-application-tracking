import { TransactionClient } from "@/utils/databaseTypes";
import prisma from "@/services/globalPrismaClient";
import {
  WorkMode,
  PayFrequency,
  CompanySize,
  CompanyType,
} from "@prisma/client";

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
  companySizes?: CompanySize[];
  companyTypes?: CompanyType[];
  workModes?: WorkMode[];
  benefits?: string[];
  payMinimum?: number;
  payMaximum?: number;
  payFrequencies?: PayFrequency[];
  currencies?: string[];
  locations?: LocationInterface;
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
  page: number;
  per: number;
}

export interface ManyJobsInterface {
  userId: string;
  include: IncludesInterface;
  filters?: FilterInterface;
  pagination?: PaginationInterface;
  select?: SelectInterface;
  client?: TransactionClient | typeof prisma;
}
