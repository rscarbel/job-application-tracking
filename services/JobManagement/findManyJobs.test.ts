import { test, expect, mock, describe } from "bun:test";
import { findManyJobs } from "./findManyJobs";
import {
  WorkMode,
  PayFrequency,
  CompanySize,
  CompanyType,
} from "@prisma/client";

describe("findManyJobs", () => {
  const mockCompanyDetails = {
    id: 1,
    name: "Tech Innovations",
    address: "123 Tech Lane, Innovation City, CA 90001, USA",
    details: {
      size: CompanySize.MEDIUM,
      type: CompanyType.PRIVATE,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJob = {
    id: 1,
    title: "Software Engineer",
    workMode: WorkMode.remote,
    responsibilities: ["Develop software", "Review code"],
    company: mockCompanyDetails,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBenefit = {
    id: 1,
    name: "Health Insurance",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLocation = {
    id: 1,
    streetAddress: "123 Tech Lane",
    streetAddress2: "Suite 100",
    city: "Innovation City",
    state: "CA",
    country: "USA",
    zipCode: "90001",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJobsFindMany = mock(async ({ where, skip, take, select }) => {
    return [mockJob];
  });

  const mockPrisma = {
    job: {
      findMany: mockJobsFindMany,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should return jobs based on filters", async () => {
    const jobs = await findManyJobs({
      userId: "user123",
      include: {
        address: true,
        compensation: true,
        benefits: true,
        company: true,
      },
      filters: {
        companies: ["Tech Innovations"],
        workModes: [WorkMode.remote],
        benefits: ["Health Insurance"],
        payMinimum: 50000,
        payMaximum: 150000,
        payFrequencies: [PayFrequency.yearly],
        currencies: ["USD"],
        companySizes: [CompanySize.MEDIUM],
        companyTypes: [CompanyType.PRIVATE],
        locations: {
          cities: ["Innovation City"],
          states: ["CA"],
          countries: ["USA"],
        },
        createdAt: new Date(),
        excludeBenefits: ["Dental Insurance"],
        excludePayFrequencies: [PayFrequency.weekly],
        excludeCurrencies: ["EUR"],
        excludeCompanies: ["Tech Innovations"],
        excludeCompanySizes: [CompanySize.SMALL],
        excludeCompanyTypes: [CompanyType.PUBLIC],
        excludeWorkModes: [WorkMode.hybrid],
        excludeLocations: {
          cities: ["Goldnerberg"],
          states: ["Texas"],
          countries: ["Germany"],
        },
      },
      pagination: {
        offset: 1,
        limit: 10,
      },
      select: {
        id: true,
        title: true,
        workMode: true,
      },
    });

    expect(jobs).toHaveLength(1);
    expect(jobs[0].title).toEqual("Software Engineer");
    expect(mockJobsFindMany).toHaveBeenCalledWith({
      where: {
        userId: "user123",
        company: {
          name: { not: { in: ["Tech Innovations"] } },
          details: {
            size: { not: { in: ["SMALL"] } },
            type: { not: { in: ["PUBLIC"] } },
          },
        },
        workMode: { not: { in: ["hybrid"] } },
        benefits: {
          some: {
            benefit: {
              name: { not: { in: ["Dental Insurance"] } },
            },
          },
        },
        compensation: {
          payAmount: { gte: 50000, lte: 150000 },
          payFrequency: { not: { in: ["weekly"] } },
          currency: { not: { in: ["EUR"] } },
        },
        address: {
          city: { not: { in: ["Goldnerberg"] } },
          state: { not: { in: ["Texas"] } },
          country: { not: { in: ["Germany"] } },
        },
        createdAt: { gte: new Date() },
      },
      skip: 1,
      take: 10,
      select: {
        id: true,
        title: true,
        workMode: true,
        company: { select: { name: true, address: true, details: true } },
        address: true,
        compensation: true,
        benefits: { select: { benefit: true } },
      },
    });
  });
});
