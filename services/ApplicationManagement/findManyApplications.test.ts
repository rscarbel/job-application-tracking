import { test, expect, mock, describe, afterEach } from "bun:test";
import { findManyApplications } from "./findManyApplications";
import { ApplicationStatus } from "@prisma/client";
import { ApplicationSortFieldEnum } from "./ManyApplicationsInterface";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("findManyApplications", () => {
  const mockApplication = {
    id: 1,
    applicationDate: new Date(),
    status: ApplicationStatus.APPLIED,
    job: {
      id: 2,
      title: "Front End Developer",
      company: {
        name: "Web Solutions",
      },
    },
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
    const applications = await findManyApplications({
      userId: "user123",
      include: {
        documents: true,
        job: true,
        interviews: true,
        tags: true,
      },
      sort: { field: ApplicationSortFieldEnum.applicationDate, order: "desc" },
      filters: {
        companies: ["Web Solutions"],
        statuses: [ApplicationStatus.APPLIED],
        tags: ["Frontend"],
        afterDate: new Date("2022-01-01"),
        beforeDate: new Date("2023-01-01"),
        excludeCompanies: ["Old Tech Corp"],
        excludeStatuses: [ApplicationStatus.REJECTED],
        excludeTags: ["Backend"],
        groups: ["group1"],
        excludeGroups: ["group2"],
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
          company: {
            name: { in: ["Web Solutions"], not: { in: ["Old Tech Corp"] } },
          },
        },
        status: { in: ["APPLIED"], not: { in: ["REJECTED"] } },
        tags: {
          some: {
            tag: {
              name: { in: ["Frontend"], not: { in: ["Backend"] } },
            },
          },
        },
        applicationDate: {
          gte: new Date("2022-01-01"),
          lte: new Date("2023-01-01"),
        },
        applicationGroup: {
          some: {
            name: { in: ["group1"], not: { in: ["group2"] } },
          },
        },
      },
      skip: 0,
      take: 5,
      orderBy: [{ applicationDate: "desc" }],
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
    const sortFields = Object.values(ApplicationSortFieldEnum);

    sortFields.forEach(async (field) => {
      await findManyApplications({
        userId: "user123",
        sort: { field, order: "asc" },
      });

      expect(mockApplicationsFindMany).toHaveBeenCalled();
    });
  });
});
