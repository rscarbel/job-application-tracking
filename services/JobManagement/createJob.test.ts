import { test, expect, mock, beforeEach, describe } from "bun:test";
import { WorkMode, PayFrequency } from "@prisma/client";
import { createJob } from "./createJob";

describe("createJob", () => {
  let mockPrisma: any;

  const mockCompany = {
    id: 1,
    name: "Tech Innovations",
    userId: "user123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    const mockCompanyConnect = mock(async ({ id }) => {
      return {
        id,
      };
    });

    const mockBenefitFindUnique = mock(() => null);
    const mockBenefitCreate = mock(async ({ data: { name, userId } }) => ({
      name,
      userId,
    }));

    const mockJobCreate = mock(
      async ({
        data: {
          title,
          workMode,
          responsibilities,
          benefits,
          description,
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
          address: {
            create: {
              streetAddress,
              streetAddress2,
              city,
              state,
              country,
              postalCode,
            },
          },
        },
      }) => {
        return {
          id: 1,
          title,
          workMode,
          responsibilities,
          description,
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
          address: {
            streetAddress,
            streetAddress2,
            city,
            state,
            country,
            postalCode,
          },
          benefits,
        };
      }
    );

    mockPrisma = {
      company: {
        connect: mockCompanyConnect,
      },
      job: {
        create: mockJobCreate,
      },
      benefit: {
        findUnique: mockBenefitFindUnique,
        create: mockBenefitCreate,
      },
      jobBenefit: {
        create: mock(() => ({})),
        findUnique: mock(() => null),
      },
    };

    mock.module("@/services/globalPrismaClient", () => {
      return { default: mockPrisma };
    });
  });

  test("should create a job with minimum content", async () => {
    const jobDetails = {
      title: "Software Engineer",
      userId: "user123",
      company: mockCompany,
      workMode: WorkMode.remote,
      compensation: {
        payFrequency: PayFrequency.monthly,
        currency: "USD",
        salaryRangeMin: 60000,
        salaryRangeMax: 90000,
        negotiable: true,
      },
    };

    await createJob(jobDetails);

    expect(mockPrisma.job.create).toHaveBeenCalledWith({
      data: {
        title: "Software Engineer",
        workMode: "remote",
        responsibilities: [],
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
            payFrequency: "monthly",
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
    });
  });

  test("should create a job with details", async () => {
    const jobDetails = {
      title: "Software Engineer",
      userId: "user123",
      company: mockCompany,
      workMode: WorkMode.remote,
      responsibilities: ["Write code", "Test code"],
      description: "A software engineer to write and test code",
      compensation: {
        payAmount: undefined,
        payFrequency: PayFrequency.monthly,
        currency: "USD",
        salaryRangeMin: 60000,
        salaryRangeMax: 90000,
        hoursWeek: 40,
        negotiable: true,
      },
      address: {
        streetAddress: "123 Main St",
        streetAddress2: undefined,
        city: "Anytown",
        state: "NY",
        country: "USA",
        postalCode: "12345",
      },
      benefits: ["Health insurance", "401k"],
    };

    await createJob(jobDetails);

    expect(mockPrisma.job.create).toHaveBeenCalledWith({
      data: {
        title: "Software Engineer",
        workMode: "remote",
        responsibilities: ["Write code", "Test code"],
        description: "A software engineer to write and test code",
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
            payAmount: undefined,
            payFrequency: "monthly",
            currency: "USD",
            salaryRangeMin: 60000,
            salaryRangeMax: 90000,
            hoursWeek: 40,
            negotiable: true,
          },
        },
        address: {
          create: {
            streetAddress: "123 Main St",
            streetAddress2: undefined,
            city: "Anytown",
            state: "NY",
            country: "USA",
            postalCode: "12345",
          },
        },
      },
    });
  });

  test("should throw error when no pay amount or salary range is provided", async () => {
    const jobDetails = {
      title: "Software Engineer",
      userId: "user123",
      company: mockCompany,
      workMode: WorkMode.remote,
      compensation: {
        payFrequency: PayFrequency.monthly,
        currency: "USD",
      },
    };

    await expect(createJob(jobDetails)).rejects.toThrow(
      "You must provide either a payAmount or a salaryRange"
    );

    expect(mockPrisma.job.create).not.toHaveBeenCalled();
  });
});
