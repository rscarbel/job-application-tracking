import prisma from "@/services/globalPrismaClient";
import { ApplicationStatus } from "@prisma/client";
import {
  ManyApplicationsInterface,
  ApplicationSortFieldEnum,
} from "./ManyApplicationsInterface";

interface WhereInterface {
  userId: string;
  job?: {
    company?: {
      name?: { in?: string[]; not?: { in: string[] } };
    };
  };
  status?: { in?: ApplicationStatus[]; not?: { in: ApplicationStatus[] } };
  tags?: {
    some: { tag: { name: { in?: string[]; not?: { in: string[] } } } };
  };
  applicationDate?: { gte?: Date; lte?: Date };
  applicationGroup?: {
    some: { name: { in?: string[]; not?: { in: string[] } } };
  };
}

const defaultInclude = {
  documents: false,
  job: false,
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
};

export const findManyApplications = async ({
  userId,
  include,
  pagination = { offset: 0, limit: 10 },
  select,
  filters,
  sort,
  client = prisma,
}: ManyApplicationsInterface) => {
  const { offset: skip, limit: take } = pagination;

  const documents = include?.documents || defaultInclude.documents;
  const job = include?.job || defaultInclude.job;
  const interviews = include?.interviews || defaultInclude.interviews;
  const tags = include?.tags || defaultInclude.tags;

  const orderBy = [];
  if (sort) {
    switch (sort.field) {
      case ApplicationSortFieldEnum.createdAt:
        orderBy.push({ createdAt: sort.order });
        break;
      case ApplicationSortFieldEnum.applicationDate:
        orderBy.push({ applicationDate: sort.order });
        break;
      case ApplicationSortFieldEnum.status:
        orderBy.push({ status: sort.order });
        break;
    }
  }

  select = select || defaultSelect;

  const where: WhereInterface = { userId };
  if (filters) {
    if (filters.companies) {
      where.job = {};
      where.job.company = {
        name: { in: filters.companies },
      };
    }

    if (filters.excludeCompanies) {
      where.job = where.job || {};
      where.job.company = {
        name: {
          ...where.job.company?.name,
          not: {
            in: filters.excludeCompanies,
          },
        },
      };
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
        some: { tag: { name: { in: filters.tags } } },
      };
    }

    if (filters.excludeTags) {
      where.tags = {
        some: {
          tag: {
            name: {
              ...where.tags?.some.tag.name,
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

    if (filters.groups) {
      where.applicationGroup = {
        some: { name: { in: filters.groups } },
      };
    }

    if (filters.excludeGroups) {
      where.applicationGroup = {
        some: {
          name: {
            ...where.applicationGroup?.some.name,
            not: { in: filters.excludeGroups },
          },
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
