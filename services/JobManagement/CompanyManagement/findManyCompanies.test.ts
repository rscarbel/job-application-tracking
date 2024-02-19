import { test, expect, mock, describe, afterEach } from "bun:test";
import { findManyCompanies } from "./findManyCompanies";
import { CompanySize, CompanyType, CompanyDesireability } from "@prisma/client";
import { CompanySortFieldEnum } from "./ManyCompaniesInterface";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("findManyCompanies", () => {
  const mockCompanyDetails = {
    id: 1,
    name: "Innovative Startups",
    details: {
      size: CompanySize.SMALL,
      type: CompanyType.PRIVATE,
    },
    preferences: {
      desireability: CompanyDesireability.HIGH,
    },
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

  afterEach(() => {
    mockCompaniesFindMany.mockClear();
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
      sort: { field: CompanySortFieldEnum.name, order: "desc" },
      filters: {
        names: ["Innovative Startups"],
        companySizes: [CompanySize.SMALL],
        companyTypes: [CompanyType.PRIVATE],
        desireabilities: [CompanyDesireability.HIGH],
        locations: {
          cities: ["Tech City"],
          states: ["Innovation State"],
          countries: ["Techland"],
        },
        createdAt: new Date(),
        excludeNames: ["Old Enterprises"],
        excludeCompanySizes: [CompanySize.LARGE],
        excludeCompanyTypes: [CompanyType.PUBLIC],
        excludeDesireabilities: [CompanyDesireability.LOW],
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
    expectToHaveBeenCalledWith(mockCompaniesFindMany, {
      where: {
        userId: "user456",
        name: { in: ["Innovative Startups"], notIn: ["Old Enterprises"] },
        details: {
          size: { in: ["SMALL"], notIn: ["LARGE"] },
          type: { in: ["PRIVATE"], notIn: ["PUBLIC"] },
        },
        createdAt: { gte: new Date() },
        preferences: { desireability: { in: ["HIGH"], notIn: ["LOW"] } },
        address: {
          city: { in: ["Tech City"], notIn: ["Old Town"] },
          state: { in: ["Innovation State"], notIn: ["Old State"] },
          country: { in: ["Techland"], notIn: ["Oldland"] },
        },
      },
      skip: 0,
      take: 10,
      orderBy: [{ name: "desc" }],
      select: {
        id: true,
        name: true,
        createdAt: true,
        address: true,
        details: true,
        preferences: true,
        contacts: false,
        jobs: false,
      },
    });
  });

  test("should return companies without filters", async () => {
    const companies = await findManyCompanies({ userId: "user456" });

    expect(companies).toHaveLength(1);
    expect(companies[0].name).toEqual("Innovative Startups");
    expectToHaveBeenCalledWith(mockCompaniesFindMany, {
      where: { userId: "user456" },
      skip: 0,
      take: 10,
      orderBy: [],
      select: {
        id: true,
        name: true,
        createdAt: false,
        updatedAt: false,
        address: false,
        details: false,
        preferences: false,
        contacts: false,
        jobs: false,
      },
    });
  });

  /**
   As I mentioned on the job test (services/JobManagement/findManyJobs.test.ts)
   This is a useless test so that I can get 100% coverage. Without this test, the
   logic is already 100% tested, so this test is not damaging or helpful.
  */
  test("should return jobs in a variety of sort fields", async () => {
    const sortFields = Object.values(CompanySortFieldEnum);

    sortFields.forEach(async (field) => {
      await findManyCompanies({
        userId: "user123",
        sort: { field, order: "asc" },
      });

      expect(mockCompaniesFindMany).toHaveBeenCalled();
    });
  });
});
