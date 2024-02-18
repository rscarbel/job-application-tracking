import { TransactionClient } from "@/utils/databaseTypes";
import prisma from "@/services/globalPrismaClient";
import { ApplicationStatus } from "@prisma/client";

export enum ApplicationSortFieldEnum {
  createdAt = "createdAt",
  status = "status",
  applicationDate = "applicationDate",
}

interface SortInterface {
  field: ApplicationSortFieldEnum;
  order: "asc" | "desc";
}

interface IncludesInterface {
  documents?: boolean;
  job?: boolean;
  interviews?: boolean;
  tags?: boolean;
}

interface FilterInterface {
  companies?: string[];
  excludeCompanies?: string[];
  statuses?: ApplicationStatus[];
  excludeStatuses?: ApplicationStatus[];
  tags?: string[];
  excludeTags?: string[];
  afterDate?: Date;
  beforeDate?: Date;
}

interface SelectInterface {
  id?: boolean;
  applicationDate?: boolean;
  applicationLink?: boolean;
  positionIndex?: boolean;
  notes?: boolean;
  status?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
}

interface PaginationInterface {
  offset: number;
  limit: number;
}

export interface ManyApplicationsInterface {
  userId: string;
  include?: IncludesInterface;
  filters?: FilterInterface;
  pagination?: PaginationInterface;
  select?: SelectInterface;
  sort?: SortInterface;
  client?: TransactionClient | typeof prisma;
}
