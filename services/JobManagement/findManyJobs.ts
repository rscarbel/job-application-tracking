import prisma from "@/services/globalPrismaClient";
import {
  WorkMode,
  PayFrequency,
  CompanySize,
  CompanyType,
} from "@prisma/client";
import { ManyJobsInterface, JobSortFieldEnum } from "./ManyJobsInterface";

interface WhereInterface {
  userId: string;
  company?: {
    name?: { in?: string[]; not?: { in: string[] } };
    details?: {
      size?: { in?: CompanySize[]; not?: { in: CompanySize[] } };
      type?: { in?: CompanyType[]; not?: { in: CompanyType[] } };
    };
  };
  workMode?: { in?: WorkMode[]; not?: { in: WorkMode[] } };
  benefits?: {
    some: { benefit: { name: { in?: string[]; not?: { in: string[] } } } };
  };
  compensation?: {
    payAmount?: { gte?: number; lte?: number };
    payFrequency?: { in?: PayFrequency[]; not?: { in: PayFrequency[] } };
    currency?: { in?: string[]; not?: { in: string[] } };
  };
  address?: {
    city?: { in?: string[]; not?: { in: string[] } };
    state?: { in?: string[]; not?: { in: string[] } };
    country?: { in?: string[]; not?: { in: string[] } };
  };
  createdAt?: { gte: Date };
}

const defaultInclude = {
  address: false,
  compensation: false,
  benefits: false,
  company: false,
};

const defaultSelect = {
  id: true,
  title: true,
  workMode: false,
  responsibilities: false,
  description: false,
  createdAt: false,
  updatedAt: false,
};

export const findManyJobs = async ({
  userId,
  include,
  pagination = { offset: 0, limit: 10 },
  select,
  filters,
  sort,
  client = prisma,
}: ManyJobsInterface) => {
  const { offset: skip, limit: take } = pagination;

  const address = include?.address || defaultInclude.address;
  const compensation = include?.compensation || defaultInclude.compensation;
  const benefits = include?.benefits || defaultInclude.benefits;
  const company = include?.company || defaultInclude.company;

  const orderBy = [];
  if (sort) {
    switch (sort.field) {
      case JobSortFieldEnum.createdAt:
        orderBy.push({ createdAt: sort.order });
        break;
      case JobSortFieldEnum.title:
        orderBy.push({ title: sort.order });
        break;
      case JobSortFieldEnum.pay:
        orderBy.push({ compensation: { payAmount: sort.order } });
        break;
      case JobSortFieldEnum.workMode:
        orderBy.push({ workMode: sort.order });
        break;
      case JobSortFieldEnum.companyName:
        orderBy.push({ company: { name: sort.order } });
        break;
      case JobSortFieldEnum.companySize:
        orderBy.push({ company: { details: { size: sort.order } } });
        break;
    }
  }

  select = select || defaultSelect;

  const where: WhereInterface = { userId };
  if (filters) {
    if (filters.companies) {
      where.company = {
        name: { in: filters.companies },
        details: where.company?.details,
      };
    }

    if (filters.excludeCompanies) {
      where.company = {
        ...where.company,
        name: {
          not: {
            in: filters.excludeCompanies,
          },
        },
      };
    }

    if (filters.companySizes || filters.companyTypes) {
      where.company = where.company || {};
      where.company.details = where.company.details || {};
      if (filters.companySizes) {
        where.company.details.size = { in: filters.companySizes };
      }

      if (filters.excludeCompanySizes) {
        where.company.details.size = {
          not: { in: filters.excludeCompanySizes },
        };
      }

      if (filters.companyTypes) {
        where.company.details.type = { in: filters.companyTypes };
      }

      if (filters.excludeCompanyTypes) {
        where.company.details.type = {
          not: { in: filters.excludeCompanyTypes },
        };
      }
    }

    if (filters.workModes) {
      where.workMode = { in: filters.workModes };
    }

    if (filters.excludeWorkModes) {
      where.workMode = { not: { in: filters.excludeWorkModes } };
    }

    if (filters.benefits) {
      where.benefits = {
        some: { benefit: { name: { in: filters.benefits } } },
      };
    }

    if (filters.excludeBenefits) {
      where.benefits = {
        some: { benefit: { name: { not: { in: filters.excludeBenefits } } } },
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

    if (filters.excludePayFrequencies) {
      where.compensation = where.compensation || {};
      where.compensation.payFrequency = {
        not: { in: filters.excludePayFrequencies },
      };
    }

    if (filters.currencies) {
      where.compensation = where.compensation || {};
      where.compensation.currency = { in: filters.currencies };
    }

    if (filters.excludeCurrencies) {
      where.compensation = where.compensation || {};
      where.compensation.currency = {
        not: { in: filters.excludeCurrencies },
      };
    }

    if (filters.locations) {
      where.address = {};
      if (filters.locations.cities) {
        where.address.city = { in: filters.locations.cities };
      }

      if (filters.locations.states) {
        where.address.state = { in: filters.locations.states };
      }
      if (filters.locations.countries) {
        where.address.country = { in: filters.locations.countries };
      }
    }

    if (filters.excludeLocations) {
      if (filters.excludeLocations.cities) {
        where.address = where.address || {};
        where.address.city = {
          not: { in: filters.excludeLocations.cities },
        };
      }

      if (filters.excludeLocations.states) {
        where.address = where.address || {};
        where.address.state = {
          not: { in: filters.excludeLocations.states },
        };
      }

      if (filters.excludeLocations.countries) {
        where.address = where.address || {};
        where.address.country = {
          not: { in: filters.excludeLocations.countries },
        };
      }
    }

    if (filters.createdAt) {
      where.createdAt = { gte: filters.createdAt };
    }
  }

  const query = {
    where,
    skip,
    take,
    orderBy,
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
