import {
  PrismaClient,
  CompanySize,
  CompanyType,
  CompanyDesireability,
} from "@prisma/client";
import prisma from "@/services/globalPrismaClient";
import { ManyCompaniesInterface } from "./ManyCompaniesInterface";

const defaultInclude = {
  address: false,
  details: false,
  preferences: false,
  contacts: false,
  jobs: false,
};

const defaultSelect = {
  id: true,
  name: true,
  createdAt: false,
  updatedAt: false,
};

interface WhereInterface {
  userId?: string;
  name?: { in?: string[]; notIn?: string[] };
  details?: {
    size?: { in?: CompanySize[]; notIn?: CompanySize[] };
    type?: { in?: CompanyType[]; notIn?: CompanyType[] };
  };
  preferences?: {
    desireability?: {
      in?: CompanyDesireability[];
      notIn?: CompanyDesireability[];
    };
  };
  address?: {
    city?: { in?: string[]; notIn?: string[] };
    state?: { in?: string[]; notIn?: string[] };
    country?: { in?: string[]; notIn?: string[] };
  };
  createdAt?: { gte: Date };
}

export const findManyCompanies = async ({
  userId,
  include = defaultInclude,
  filters,
  pagination = { offset: 0, limit: 10 },
  select = defaultSelect,
  client = prisma,
}: ManyCompaniesInterface) => {
  const { offset: skip, limit: take } = pagination;

  const where: WhereInterface = {};
  if (userId) {
    where.userId = userId;
  }

  if (filters) {
    if (filters.names) {
      where.name = { in: filters.names };
    }
    if (filters.excludeNames) {
      where.name = { notIn: filters.excludeNames };
    }
    if (filters.companySizes) {
      where.details = { size: { in: filters.companySizes } };
    }
    if (filters.excludeCompanySizes) {
      where.details = { size: { notIn: filters.excludeCompanySizes } };
    }
    if (filters.companyTypes) {
      where.details = { type: { in: filters.companyTypes } };
    }
    if (filters.excludeCompanyTypes) {
      where.details = { type: { notIn: filters.excludeCompanyTypes } };
    }
    if (filters.createdAt) {
      where.createdAt = { gte: filters.createdAt };
    }
    if (filters.desireabilities) {
      where.preferences = { desireability: { in: filters.desireabilities } };
    }
    if (filters.excludeDesireabilities) {
      where.preferences = {
        desireability: { notIn: filters.excludeDesireabilities },
      };
    }
    if (filters.locations) {
      if (filters.locations.cities) {
        where.address = { city: { in: filters.locations.cities } };
      }
      if (filters.locations.states) {
        where.address = { state: { in: filters.locations.states } };
      }
      if (filters.locations.countries) {
        where.address = { country: { in: filters.locations.countries } };
      }
    }
    if (filters.excludeLocations) {
      if (filters.excludeLocations.cities) {
        where.address = { city: { notIn: filters.excludeLocations.cities } };
      }
      if (filters.excludeLocations.states) {
        where.address = { state: { notIn: filters.excludeLocations.states } };
      }
      if (filters.excludeLocations.countries) {
        where.address = {
          country: { notIn: filters.excludeLocations.countries },
        };
      }
    }
  }

  const query = {
    where,
    skip,
    take,
    select: {
      ...select,
      address: include.address ? { select: {} } : false,
      details: include.details ? { select: {} } : false,
      preferences: include.preferences ? { select: {} } : false,
      contacts: include.contacts ? { select: {} } : false,
      jobs: include.jobs ? { select: {} } : false,
    },
  };

  const companies = await client.company.findMany(query);
  return companies;
};
