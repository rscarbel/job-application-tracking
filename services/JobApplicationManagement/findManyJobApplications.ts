import prisma from "@/services/globalPrismaClient";
import {
  ApplicationStatus,
  CompanySize,
  CompanyType,
  WorkMode,
  PayFrequency,
} from "@prisma/client";
import {
  JobApplicationSortFieldEnum,
  ManyJobApplicationsInterface,
  OrderDirectionEnum,
} from "./ManyJobApplicationsInterface";

interface WhereInterface {
  userId: string;
  applicationDate?: { gte?: Date; lte?: Date };
  applicationGroup?: {
    isActive?: boolean;
    name?: { in?: string[]; not?: { in: string[] } };
  };
  status?: { in?: ApplicationStatus[]; not?: { in: ApplicationStatus[] } };
  job?: {
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
  };
  tags?: {
    some: { tag: { value: { in?: string[]; not?: { in: string[] } } } };
  };
}

const defaultInclude = {
  documents: false,
  job: true,
  interviews: false,
  tags: false,
};

const defaultSelect = {
  id: true,
  applicationDate: true,
  applicationLink: false,
  notes: false,
  positionIndex: false,
  status: true,
  createdAt: false,
  updatedAt: false,
  job: {
    select: {
      id: true,
      title: true,
      workMode: true,
      company: {
        select: {
          name: true,
          details: true,
        },
      },
      address: true,
      compensation: true,
    },
  },
};

export const findManyJobApplications = async ({
  userId,
  include,
  pagination = { offset: 0, limit: 10 },
  select,
  filters,
  sort,
  client = prisma,
}: ManyJobApplicationsInterface) => {
  const { offset: skip, limit: take } = pagination;

  const documents = include?.documents || defaultInclude.documents;
  const job = include?.job || defaultInclude.job;
  const interviews = include?.interviews || defaultInclude.interviews;
  const tags = include?.tags || defaultInclude.tags;

  const orderBy = [];

  switch (sort?.field) {
    case JobApplicationSortFieldEnum.createdAt:
      orderBy.push({ createdAt: sort.order });
      break;
    case JobApplicationSortFieldEnum.applicationDate:
      orderBy.push({ applicationDate: sort.order });
      break;
    case JobApplicationSortFieldEnum.status:
      orderBy.push({ status: sort.order });
      break;
    case JobApplicationSortFieldEnum.title:
      orderBy.push({ job: { title: sort.order } });
      break;
    case JobApplicationSortFieldEnum.workMode:
      orderBy.push({ job: { workMode: sort.order } });
      break;
    case JobApplicationSortFieldEnum.pay:
      orderBy.push({ job: { compensation: { payAmount: sort.order } } });
      break;
    case JobApplicationSortFieldEnum.companyName:
      orderBy.push({ job: { company: { name: sort.order } } });
      break;
    case JobApplicationSortFieldEnum.companySize:
      orderBy.push({ job: { company: { details: { size: sort.order } } } });
      break;
    default:
      orderBy.push({ positionIndex: OrderDirectionEnum.asc });
      break;
  }

  select = select || defaultSelect;

  const where: WhereInterface = { userId };

  if (filters) {
    const hasCompanyFilters =
      filters.companies ||
      filters.excludeCompanies ||
      filters.companySizes ||
      filters.excludeCompanies ||
      filters.companyTypes ||
      filters.excludeCompanyTypes;

    const hasJobFilters =
      filters.workModes ||
      filters.excludeWorkModes ||
      filters.benefits ||
      filters.excludeBenefits ||
      filters.locations ||
      filters.excludeLocations ||
      filters.payFrequencies ||
      filters.excludePayFrequencies ||
      filters.payMinimum ||
      filters.payMaximum;

    if (hasJobFilters) {
      where.job = {};
      if (filters.workModes) {
        where.job.workMode = { in: filters.workModes };
      }

      if (filters.excludeWorkModes) {
        where.job.workMode = {
          ...where.job.workMode,
          not: { in: filters.excludeWorkModes },
        };
      }

      if (filters.benefits) {
        if (filters.benefits) {
          where.job.benefits = {
            some: { benefit: { name: { in: filters.benefits } } },
          };
        }
      }

      if (filters.excludeBenefits) {
        where.job.benefits = {
          some: {
            benefit: {
              name: {
                ...where.job.benefits?.some.benefit.name,
                not: { in: filters.excludeBenefits },
              },
            },
          },
        };
      }

      if (filters.payMinimum || filters.payMaximum) {
        where.job.compensation = where.job.compensation || {};
        if (filters.payMinimum) {
          where.job.compensation.payAmount = {
            ...(where.job.compensation.payAmount || {}),
            gte: filters.payMinimum,
          };
        }
        if (filters.payMaximum) {
          where.job.compensation.payAmount = {
            ...(where.job.compensation.payAmount || {}),
            lte: filters.payMaximum,
          };
        }
      }

      if (filters.payFrequencies) {
        where.job.compensation = where.job.compensation || {};
        where.job.compensation.payFrequency = { in: filters.payFrequencies };
      }

      if (filters.excludePayFrequencies) {
        where.job.compensation = where.job.compensation || {};
        where.job.compensation.payFrequency = {
          ...where.job.compensation.payFrequency,
          not: { in: filters.excludePayFrequencies },
        };
      }

      if (filters.currencies) {
        where.job.compensation = where.job.compensation || {};
        where.job.compensation.currency = { in: filters.currencies };
      }

      if (filters.excludeCurrencies) {
        where.job.compensation = where.job.compensation || {};
        where.job.compensation.currency = {
          ...where.job.compensation.currency,
          not: { in: filters.excludeCurrencies },
        };
      }

      if (filters.locations) {
        where.job.address = {};
        if (filters.locations.cities) {
          where.job.address.city = { in: filters.locations.cities };
        }

        if (filters.locations.states) {
          where.job.address.state = {
            in: filters.locations.states,
          };
        }
        if (filters.locations.countries) {
          where.job.address.country = { in: filters.locations.countries };
        }
      }

      if (filters.excludeLocations) {
        where.job.address = where.job.address || {};

        if (filters.excludeLocations.cities) {
          where.job.address.city = {
            ...where.job.address.city,
            not: { in: filters.excludeLocations.cities },
          };
        }

        if (filters.excludeLocations.states) {
          where.job.address.state = {
            ...where.job.address.state,
            not: { in: filters.excludeLocations.states },
          };
        }

        if (filters.excludeLocations.countries) {
          where.job.address.country = {
            ...where.job.address.country,
            not: { in: filters.excludeLocations.countries },
          };
        }
      }
    }

    if (hasCompanyFilters) {
      where.job = where.job || {};
      where.job.company = {};

      if (filters.companies) {
        where.job.company = {
          name: { in: filters.companies },
        };
      }

      if (filters.excludeCompanies) {
        where.job.company = {
          name: {
            ...where.job.company?.name,
            not: {
              in: filters.excludeCompanies,
            },
          },
        };
      }

      if (filters.companySizes || filters.companyTypes) {
        where.job = where.job || {};
        where.job.company = where.job.company || {};
        where.job.company.details = where.job.company.details || {};

        if (filters.companySizes) {
          where.job.company.details.size = { in: filters.companySizes };
        }

        if (filters.excludeCompanySizes) {
          where.job.company.details.size = {
            ...where.job.company.details.size,
            not: { in: filters.excludeCompanySizes },
          };
        }

        if (filters.companyTypes) {
          where.job.company.details.type = { in: filters.companyTypes };
        }
      }
    }

    if (filters.statuses) {
      where.status = { in: filters.statuses };
    }

    if (filters.excludeStatuses) {
      where.status = {
        ...where.status,
        not: { in: filters.excludeStatuses },
      };
    }

    if (filters.tags) {
      where.tags = {
        some: { tag: { value: { in: filters.tags } } },
      };
    }

    if (filters.excludeTags) {
      where.tags = {
        some: {
          tag: {
            value: {
              ...where.tags?.some.tag.value,
              not: { in: filters.excludeTags },
            },
          },
        },
      };
    }

    if (filters.afterDate) {
      where.applicationDate = { gte: filters.afterDate };
    }

    if (filters.beforeDate) {
      where.applicationDate = {
        ...where.applicationDate,
        lte: filters.beforeDate,
      };
    }

    where.applicationGroup = {
      isActive: true,
    };

    if (filters.groups) {
      where.applicationGroup = {
        name: { in: filters.groups },
      };
    }

    if (filters.excludeGroups) {
      where.applicationGroup = {
        name: {
          ...where.applicationGroup?.name,
          not: { in: filters.excludeGroups },
        },
      };
    }
  }

  const query = {
    where,
    skip,
    take,
    orderBy,
    select: {
      ...select,
      documents,
      job,
      interviews,
      tags,
    },
  };

  const applications = await client.application.findMany(query);
  return applications;
};
