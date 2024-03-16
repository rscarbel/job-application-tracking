import { TransactionClient } from "@/utils/databaseTypes";
import prisma from "@/services/globalPrismaClient";
import {
  WorkMode,
  PayFrequency,
  CompanySize,
  CompanyType,
} from "@prisma/client";
import { ApplicationStatus } from "@prisma/client";

export enum JobApplicationSortFieldEnum {
  applicationDate = "applicationDate",
  companyName = "companyName",
  companySize = "companySize",
  createdAt = "createdAt",
  pay = "pay",
  status = "status",
  title = "title",
  workMode = "workMode",
}

export enum OrderDirectionEnum {
  asc = "asc",
  desc = "desc",
}

interface SortInterface {
  field: JobApplicationSortFieldEnum;
  order: OrderDirectionEnum;
}

interface IncludesInterface {
  address?: boolean;
  benefits?: boolean;
  company?: boolean;
  compensation?: boolean;
  documents?: boolean;
  interviews?: boolean;
  job?: boolean;
  tags?: boolean;
}

interface LocationInterface {
  cities?: string[];
  states?: string[];
  countries?: string[];
}

interface FilterInterface {
  afterDate?: Date;
  beforeDate?: Date;
  benefits?: string[];
  companies?: string[];
  companySizes?: CompanySize[];
  companyTypes?: CompanyType[];
  createdAt?: Date;
  currencies?: string[];
  excludeBenefits?: string[];
  excludeCompanies?: string[];
  excludeCompanySizes?: CompanySize[];
  excludeCompanyTypes?: CompanyType[];
  excludeCurrencies?: string[];
  excludeGroups?: string[];
  excludeLocations?: LocationInterface;
  excludePayFrequencies?: PayFrequency[];
  excludeStatuses?: ApplicationStatus[];
  excludeTags?: string[];
  excludeWorkModes?: WorkMode[];
  groups?: string[];
  locations?: LocationInterface;
  payFrequencies?: PayFrequency[];
  payMaximum?: number;
  payMinimum?: number;
  statuses?: ApplicationStatus[];
  tags?: string[];
  workModes?: WorkMode[];
}

interface SelectInterface {
  applicationDate?: boolean;
  applicationLink?: boolean;
  createdAt?: boolean;
  description?: boolean;
  id?: boolean;
  notes?: boolean;
  positionIndex?: boolean;
  responsibilities?: boolean;
  status?: boolean;
  title?: boolean;
  updatedAt?: boolean;
  workMode?: boolean;
}

interface PaginationInterface {
  offset: number;
  limit: number;
}

export interface ManyJobApplicationsInterface {
  userId: string;
  include?: IncludesInterface;
  filters?: FilterInterface;
  pagination?: PaginationInterface;
  select?: SelectInterface;
  sort?: SortInterface;
  organizeByStatus?: boolean;
  client?: TransactionClient | typeof prisma;
}
