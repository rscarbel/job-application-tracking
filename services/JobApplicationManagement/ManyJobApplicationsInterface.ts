import { TransactionClient } from "@/utils/databaseTypes";
import prisma from "@/services/globalPrismaClient";
import {
  CompanySize,
  CompanyType,
  PayFrequency,
  WorkMode,
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

interface LocationInterface {
  cities?: string[];
  countries?: string[];
  states?: string[];
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

export interface IncludesInterface {
  address?: boolean;
  company?: boolean;
  job?: boolean;
  compensation?: boolean;
  tags?: boolean;
  documents?: boolean;
  group?: boolean;
  interviews?: boolean;
}

interface CompanyFieldsInterface {
  name?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
  notes?: boolean;
  id?: boolean;
  culture?: boolean;
  size?: boolean;
  website?: boolean;
  type?: boolean;
  history?: boolean;
  mission?: boolean;
  vision?: boolean;
  values?: boolean;
  description?: boolean;
  desireability?: boolean;
  industry?: boolean;
}

interface AddressFieldsInterface {
  city?: boolean;
  country?: boolean;
  postalCode?: boolean;
  state?: boolean;
  streetAddress?: boolean;
  streetAddress2?: boolean;
}

interface JobDetailsInterface {
  id?: boolean;
  title?: boolean;
  responsibilities?: boolean;
  description?: boolean;
  workMode?: boolean;
  payAmount?: boolean;
  payFrequency?: boolean;
  currency?: boolean;
  salaryRangeMin?: boolean;
  salaryRangeMax?: boolean;
  hoursWeek?: boolean;
  negotiable?: boolean;
  benefits?: boolean;
}

export interface SelectInterface {
  applicationDate?: boolean;
  applicationLink?: boolean;
  createdAt?: boolean;
  description?: boolean;
  id?: boolean;
  notes?: boolean;
  positionIndex?: boolean;
  status?: boolean;
  updatedAt?: boolean;
  companyFields?: CompanyFieldsInterface;
  addressFields?: AddressFieldsInterface;
  jobFields?: JobDetailsInterface;
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
