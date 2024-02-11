import prisma from "@/services/globalPrismaClient";
import { TransactionClient } from "@/utils/databaseTypes";
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

interface ManyJobsInterface {
  userId: string;
  include: IncludesInterface;
  filters?: FilterInterface;
  pagination?: PaginationInterface;
  select?: SelectInterface;
  client?: TransactionClient | typeof prisma;
}

interface WhereInterface {
  userId: string;
  company?: {
    name: { in: string[] };
    details?: {
      size?: { in: CompanySize[] };
      type?: { in: CompanyType[] };
    };
  };
  workMode?: { in: WorkMode[] };
  benefits?: { some: { benefit: { name: { in: string[] } } } };
  compensation?: {
    payAmount?: { gte?: number; lte?: number };
    payFrequency?: { in: PayFrequency[] };
    currency?: { in: string[] };
  };
  address?: {
    city: { in: string[] };
    state: { in: string[] };
    country: { in: string[] };
  };
  createdAt?: { gte: Date };
}

export const findManyJobs = async ({
  userId,
  include: {
    address = false,
    compensation = false,
    benefits = false,
    company = false,
  },
  pagination = { page: 1, per: 10 },
  select,
  filters,
  client = prisma,
}: ManyJobsInterface) => {
  const skip = (pagination.page - 1) * pagination.per;
  const take = pagination.per;

  const where: WhereInterface = { userId };
  if (filters) {
    if (filters.companies) {
      where.company = {
        name: { in: filters.companies },
        details: where.company?.details,
      };
    }

    if (where.company && (filters.companySizes || filters.companyTypes)) {
      where.company = where.company || {};
      where.company.details = where.company.details || {};
      if (filters.companySizes) {
        where.company.details.size = { in: filters.companySizes };
      }
      if (filters.companyTypes) {
        where.company.details.type = { in: filters.companyTypes };
      }
    }

    if (filters.workModes) {
      where.workMode = { in: filters.workModes };
    }

    if (filters.benefits) {
      where.benefits = {
        some: { benefit: { name: { in: filters.benefits } } },
      };
    }

    if (filters.payMinimum || filters.payMaximum) {
      where.compensation = where.compensation || {};
      if (filters.payMinimum) {
        where.compensation.payAmount = {
          ...(where.compensation.payAmount || {}),
          gte: filters.payMinimum,
        };
      }
      if (filters.payMaximum) {
        where.compensation.payAmount = {
          ...(where.compensation.payAmount || {}),
          lte: filters.payMaximum,
        };
      }
    }

    if (filters.payFrequencies) {
      where.compensation = where.compensation || {};
      where.compensation.payFrequency = { in: filters.payFrequencies };
    }

    if (filters.currencies) {
      where.compensation = where.compensation || {};
      where.compensation.currency = { in: filters.currencies };
    }

    if (filters.locations) {
      where.address = {
        city: { in: filters.locations.cities || [] },
        state: { in: filters.locations.states || [] },
        country: { in: filters.locations.countries || [] },
      };
    }

    if (filters.createdAt) {
      where.createdAt = { gte: filters.createdAt };
    }
  }

  const query = {
    where,
    skip,
    take,
    select: {
      ...select,
      company: company
        ? { select: { name: true, address: true, details: true } }
        : false,
      address,
      compensation,
      benefits: benefits ? { select: { benefit: true } } : false,
    },
  };

  const jobs = await client.job.findMany(query);
  return jobs;
};
