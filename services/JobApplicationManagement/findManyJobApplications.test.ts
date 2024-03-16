import { test, expect, mock, describe, afterEach } from "bun:test";
import { findManyJobApplications } from "./findManyJobApplications";
import {
  ApplicationStatus,
  WorkMode,
  PayFrequency,
  CompanySize,
  CompanyType,
} from "@prisma/client";
import {
  JobApplicationSortFieldEnum,
  OrderDirectionEnum,
} from "./ManyJobApplicationsInterface";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("findManyJobApplications", () => {
  const mockCompanyDetails = {
    id: 1,
    name: "Web Solutions",
    address: "123 Tech Lane, Innovation City, CA 90001, USA",
    details: {
      size: CompanySize.MEDIUM,
      type: CompanyType.PRIVATE,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJob = {
    id: 2,
    title: "Front End Developer",
    workMode: WorkMode.REMOTE,
    responsibilities: ["Develop software", "Review code"],
    company: mockCompanyDetails,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockApplicationGroup = {};

  const mockApplication = {
    id: 1,
    applicationDate: new Date(),
    status: ApplicationStatus.APPLIED,
    positionIndex: 69,
    applicationGroup: mockApplicationGroup,
    job: mockJob,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockApplicationsFindMany = mock(
    async ({ where, skip, take, select }) => {
      return [mockApplication];
    }
  );

  const mockPrisma = {
    application: {
      findMany: mockApplicationsFindMany,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  afterEach(() => {
    mockApplicationsFindMany.mockClear();
  });

  test("should return applications based on filters", async () => {
    const applications = await findManyJobApplications({
      userId: "user123",
      include: {
        documents: true,
        job: true,
        interviews: true,
        tags: true,
        company: true,
        address: true,
        compensation: true,
      },
      sort: {
        field: JobApplicationSortFieldEnum.applicationDate,
        order: OrderDirectionEnum.desc,
      },
      filters: {
        afterDate: new Date("2022-01-01"),
        beforeDate: new Date("2023-01-01"),
        benefits: ["free car"],
        companies: ["Web Solutions"],
        companySizes: [CompanySize.MEDIUM],
        companyTypes: [CompanyType.PRIVATE],
        currencies: ["USD"],
        excludeBenefits: ["Dental Insurance"],
        excludeCompanies: ["Old Tech Corp"],
        excludeCompanySizes: [CompanySize.SMALL],
        excludeCompanyTypes: [CompanyType.PUBLIC],
        excludeCurrencies: ["EUR"],
        excludeGroups: ["group2"],
        excludeLocations: {
          cities: ["Goldnerberg"],
          states: ["Texas"],
          countries: ["Germany"],
        },
        excludePayFrequencies: [PayFrequency.WEEKLY],
        excludeStatuses: [ApplicationStatus.REJECTED],
        excludeTags: ["Backend"],
        excludeWorkModes: [WorkMode.HYBRID],
        groups: ["group1"],
        locations: {
          cities: ["Innovation City"],
          states: ["CA"],
          countries: ["USA"],
        },
        payFrequencies: [PayFrequency.ANNUALLY],
        payMaximum: 150000,
        payMinimum: 50000,
        statuses: [ApplicationStatus.APPLIED],
        tags: ["Frontend"],
        workModes: [WorkMode.REMOTE],
      },
      pagination: {
        offset: 0,
        limit: 5,
      },
      select: {
        id: true,
        applicationDate: true,
        status: true,
      },
    });

    expect(applications).toHaveLength(1);
    expect(applications[0].status).toEqual(ApplicationStatus.APPLIED);
    expectToHaveBeenCalledWith(mockApplicationsFindMany, {
      where: {
        userId: "user123",
        job: {
          workMode: { in: [WorkMode.REMOTE], not: { in: [WorkMode.HYBRID] } },
          benefits: {
            some: {
              benefit: {
                name: { in: ["free car"], not: { in: ["Dental Insurance"] } },
              },
            },
          },
          compensation: {
            payAmount: { gte: 50000, lte: 150000 },
            payFrequency: {
              in: [PayFrequency.ANNUALLY],
              not: { in: [PayFrequency.WEEKLY] },
            },
            currency: { in: ["USD"], not: { in: ["EUR"] } },
          },
          address: {
            city: { in: ["Innovation City"], not: { in: ["Goldnerberg"] } },
            state: { in: ["CA"], not: { in: ["Texas"] } },
            country: { in: ["USA"], not: { in: ["Germany"] } },
          },
          company: {
            name: { in: ["Web Solutions"], not: { in: ["Old Tech Corp"] } },
            details: {
              size: {
                in: [CompanySize.MEDIUM],
                not: { in: [CompanySize.SMALL] },
              },
              type: { in: [CompanyType.PRIVATE] },
            },
          },
        },
        status: { in: ["APPLIED"], not: { in: ["REJECTED"] } },
        tags: {
          some: {
            tag: {
              value: { in: ["Frontend"], not: { in: ["Backend"] } },
            },
          },
        },
        applicationDate: {
          gte: new Date("2022-01-01"),
          lte: new Date("2023-01-01"),
        },
        applicationGroup: {
          name: { in: ["group1"], not: { in: ["group2"] } },
        },
      },
      skip: 0,
      take: 5,
      orderBy: [{ applicationDate: OrderDirectionEnum.desc }],
      select: {
        id: true,
        applicationDate: true,
        status: true,
        documents: true,
        job: true,
        interviews: true,
        tags: true,
      },
    });
  });

  test("should return jobs in a variety of sort fields", async () => {
    const sortFields = Object.values(JobApplicationSortFieldEnum);

    sortFields.forEach(async (field) => {
      await findManyJobApplications({
        userId: "user123",
        sort: { field, order: OrderDirectionEnum.asc },
      });

      expect(mockApplicationsFindMany).toHaveBeenCalled();
    });
  });
});
