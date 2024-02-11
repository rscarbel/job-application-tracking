import { test, expect, mock, describe } from "bun:test";
import { findManyCompanies } from "./findManyCompanies";
import { CompanySize, CompanyType, CompanyDesireability } from "@prisma/client";

describe("findManyCompanies", () => {
  const mockCompanyDetails = {
    id: 1,
    name: "Innovative Startups",
    details: {
      size: CompanySize.SMALL,
      type: CompanyType.PRIVATE,
    },
    preferences: {
      desireability: CompanyDesireability.high,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAddress = {
    id: 1,
    city: "Tech City",
    state: "Innovation State",
    country: "Techland",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCompaniesFindMany = mock(async ({ where, skip, take, select }) => {
    return [mockCompanyDetails];
  });

  const mockPrisma = {
    company: {
      findMany: mockCompaniesFindMany,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should return companies based on filters", async () => {
    const companies = await findManyCompanies({
      userId: "user456",
      include: {
        address: true,
        details: true,
        preferences: true,
        contacts: false,
        jobs: false,
      },
      filters: {
        names: ["Innovative Startups"],
        companySizes: [CompanySize.SMALL],
        companyTypes: [CompanyType.PRIVATE],
        desireabilities: [CompanyDesireability.high],
        locations: {
          cities: ["Tech City"],
          states: ["Innovation State"],
          countries: ["Techland"],
        },
        createdAt: new Date(),
        excludeNames: ["Old Enterprises"],
        excludeCompanySizes: [CompanySize.LARGE],
        excludeCompanyTypes: [CompanyType.PUBLIC],
        excludeDesireabilities: [CompanyDesireability.low],
        excludeLocations: {
          cities: ["Old Town"],
          states: ["Old State"],
          countries: ["Oldland"],
        },
      },
      pagination: {
        offset: 0,
        limit: 10,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    expect(companies).toHaveLength(1);
    expect(companies[0].name).toEqual("Innovative Startups");
    expect(mockCompaniesFindMany).toHaveBeenCalledWith({
      where: {
        userId: "user456",
        name: { notIn: ["Old Enterprises"] },
        details: { type: { notIn: ["PUBLIC"] } },
        createdAt: { gte: new Date() },
        preferences: { desireability: { notIn: ["low"] } },
        address: { country: { notIn: ["Oldland"] } },
      },
      skip: 0,
      take: 10,
      select: {
        id: true,
        name: true,
        createdAt: true,
        address: { select: {} },
        details: { select: {} },
        preferences: { select: {} },
        contacts: false,
        jobs: false,
      },
    });
  });
});
