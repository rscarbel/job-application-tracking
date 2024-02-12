import { CompanySize, CompanyType, CompanyDesireability } from "@prisma/client";
import { TransactionClient } from "@/utils/databaseTypes";
import prisma from "@/services/globalPrismaClient";

export enum CompanySortFieldEnum {
  createdAt = "createdAt",
  name = "name",
  size = "size",
  type = "type",
  city = "city",
  state = "state",
  desireability = "desireability",
}

interface SortInterface {
  field: CompanySortFieldEnum;
  order: "asc" | "desc";
}

interface IncludesInterface {
  address?: boolean;
  details?: boolean;
  preferences?: boolean;
  contacts?: boolean;
  jobs?: boolean;
}

interface LocationInterface {
  cities?: string[];
  states?: string[];
  countries?: string[];
}

interface FilterInterface {
  names?: string[];
  excludeNames?: string[];
  desireabilities?: CompanyDesireability[];
  excludeDesireabilities?: CompanyDesireability[];
  companySizes?: CompanySize[];
  excludeCompanySizes?: CompanySize[];
  companyTypes?: CompanyType[];
  excludeCompanyTypes?: CompanyType[];
  locations?: LocationInterface;
  excludeLocations?: LocationInterface;
  createdAt?: Date;
}

interface SelectInterface {
  id?: boolean;
  name?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
}

interface PaginationInterface {
  offset: number;
  limit: number;
}

export interface ManyCompaniesInterface {
  userId?: string;
  include?: IncludesInterface;
  filters?: FilterInterface;
  pagination?: PaginationInterface;
  sort?: SortInterface;
  select?: SelectInterface;
  client?: TransactionClient | typeof prisma;
}
