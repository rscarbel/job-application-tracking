import { test, expect, mock, beforeEach, describe } from "bun:test";
import { WorkMode, PayFrequency } from "@prisma/client";
import { createJob } from "./createJob";

describe("createJob", () => {
  let mockPrisma: any;

  beforeEach(() => {
    const mockFindUnique = mock(
      async ({
        where: {
          name_userId: { name, userId },
        },
      }) => {
        if (name === "Tech Innovations" && userId === "user123") {
          return {
            id: 1,
            name: "Tech Innovations",
            userId: "user123",
          };
        }

        return null;
      }
    );

    const mockJobCreate = mock(
      async ({
        data: {
          title,
          workMode,
          company: {
            connect: { id },
          },
          user: {
            connect: { id: userId },
          },
          compensation: {
            create: {
              payAmount,
              payFrequency,
              currency,
              salaryRangeMin,
              salaryRangeMax,
              hoursWeek,
              negotiable,
            },
          },
          address,
        },
        include: { company: includeCompany, compensation: includeCompensation },
      }) => {
        return {
          id: 1,
          title,
          workMode,
          company: {
            id,
          },
          user: {
            id: userId,
          },
          compensation: {
            id: 1,
            payAmount,
            payFrequency,
            currency,
            salaryRangeMin,
            salaryRangeMax,
            hoursWeek,
            negotiable,
          },
          address,
          include: {
            company: includeCompany,
            compensation: includeCompensation,
          },
        };
      }
    );

    mockPrisma = {
      company: {
        findUnique: mockFindUnique,
      },
      job: {
        create: mockJobCreate,
      },
    };

    mock.module("@/services/globalPrismaClient", () => {
      return { default: mockPrisma };
    });
  });

  test("should create a job with an empty address", async () => {
    const jobDetails = {
      title: "Software Engineer",
      userId: "user123",
      companyName: "Tech Innovations",
      workMode: WorkMode.remote,
      compensation: {
        payFrequency: PayFrequency.monthly,
        currency: "USD",
        salaryRangeMin: 60000,
        salaryRangeMax: 90000,
        negotiable: true,
      },
    };

    const job = await createJob(jobDetails);

    expect(mockPrisma.job.create).toHaveBeenCalledWith({
      data: {
        title: "Software Engineer",
        workMode: WorkMode.remote,
        company: {
          connect: {
            id: 1,
          },
        },
        user: {
          connect: {
            id: "user123",
          },
        },
        compensation: {
          create: {
            payFrequency: PayFrequency.monthly,
            currency: "USD",
            salaryRangeMin: 60000,
            salaryRangeMax: 90000,
            negotiable: true,
          },
        },
        address: {
          create: {
            streetAddress: "",
            streetAddress2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
          },
        },
      },
      include: {
        company: false,
        compensation: false,
      },
    });
  });

  test("should create a job with an address", async () => {
    const jobDetails = {
      title: "Software Engineer",
      userId: "user123",
      companyName: "Tech Innovations",
      workMode: WorkMode.remote,
      compensation: {
        payFrequency: PayFrequency.monthly,
        currency: "USD",
        salaryRangeMin: 60000,
        salaryRangeMax: 90000,
        hoursWeek: 40,
        negotiable: true,
      },
      address: {
        streetAddress: "123 Main St",
        city: "Anytown",
        state: "NY",
        country: "USA",
        postalCode: "12345",
      },
      includeCompany: true,
      includeCompensation: true,
    };

    const job = await createJob(jobDetails);

    expect(job).toMatchObject({
      id: 1,
      title: "Software Engineer",
      workMode: "remote",
      company: {
        id: 1,
      },
      user: {
        id: "user123",
      },
      compensation: {
        id: 1,
        payAmount: undefined,
        payFrequency: "monthly",
        currency: "USD",
        salaryRangeMin: 60000,
        salaryRangeMax: 90000,
        hoursWeek: 40,
        negotiable: true,
      },
      address: {
        create: {
          streetAddress: "123 Main St",
          city: "Anytown",
          state: "NY",
          country: "USA",
          postalCode: "12345",
        },
      },
      include: {
        company: true,
        compensation: true,
      },
    });
  });

  test("should throw error when no company is found", async () => {
    const jobDetails = {
      title: "Software Engineer",
      userId: "user123",
      companyName: "Nonexistent Corp",
      workMode: WorkMode.remote,
      compensation: {
        payFrequency: PayFrequency.monthly,
        currency: "USD",
        salaryRangeMin: 60000,
        salaryRangeMax: 90000,
        negotiable: true,
      },
    };

    await expect(createJob(jobDetails)).rejects.toThrow("Company not found");

    expect(mockPrisma.company.findUnique).toHaveBeenCalled();
    expect(mockPrisma.job.create).not.toHaveBeenCalled();
  });

  test("should throw error when no pay amount or salary range is provided", async () => {
    const jobDetails = {
      title: "Software Engineer",
      userId: "user123",
      companyName: "Tech Innovations",
      workMode: WorkMode.remote,
      compensation: {
        payFrequency: PayFrequency.monthly,
        currency: "USD",
      },
    };

    await expect(createJob(jobDetails)).rejects.toThrow(
      "You must provide either a payAmount or a salaryRange"
    );

    expect(mockPrisma.company.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.job.create).not.toHaveBeenCalled();
  });
});
