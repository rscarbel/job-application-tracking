import { test, expect, mock, describe } from "bun:test";
import { updateJob } from "./updateJob";
import { WorkMode } from "@prisma/client";

describe("updateJob", () => {
  const mockCompany = {
    id: 1,
    name: "Tech Innovations",
    userId: "user123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJob = {
    id: 1,
    title: "Software Engineer",
    userId: "user123",
    company: mockCompany,
    workMode: WorkMode.remote,
    responsibilities: ["Existing responsibility"],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBenefit = {
    id: 1,
    name: "Health Insurance",
    userId: "user123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJobUpdate = mock(async ({ where: { id }, data }) => {
    return { id, ...data };
  });

  const mockCompensationUpdate = mock(
    async ({
      where: { jobId },
      data: {
        payAmount,
        payFrequency,
        currency,
        salaryRangeMin,
        salaryRangeMax,
        hoursWeek,
        negotiable,
      },
    }) => {
      if (jobId === 1) {
        return {
          payAmount,
          payFrequency,
          currency,
          salaryRangeMin,
          salaryRangeMax,
          hoursWeek,
          negotiable,
          id: 1,
          jobId,
          updatedAt: new Date(),
          createdAt: new Date(),
        };
      } else {
        return null;
      }
    }
  );

  const mockAddressUpdate = mock(
    async ({
      where: { jobId },
      data: { streetAddress, streetAddress2, city, state, postalCode, country },
    }) => ({
      jobId,
      address: {
        streetAddress,
        streetAddress2,
        city,
        state,
        postalCode,
        country,
      },
    })
  );

  const mockFindBenefit = mock(
    ({
      where: {
        name_userId: { name, userId },
      },
    }) => {
      const nameMatches = name === mockBenefit.name;
      const userIdMatches = userId === mockBenefit.userId;
      const isFound = nameMatches && userIdMatches;

      isFound ? mockBenefit : null;
    }
  );

  const mockCreateBenefit = mock(async ({ data: { name, userId } }) => ({
    id: 2,
    name: name,
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const mockJobFindUnique = mock(
    async ({ where: { title, userId, company, workMode } }) => mockJob
  );

  const mockJobBenefitFindUnique = mock(
    async ({
      where: {
        jobId_benefitId: { jobId, benefitId },
      },
    }) => {
      const jobIdMatches = jobId === 1;
      const benefitIdMatches = benefitId === mockBenefit.id;
      const isFound = jobIdMatches && benefitIdMatches;

      return isFound ? { jobId, benefitId } : null;
    }
  );

  const mockJobBenefitCreate = mock(async (args) => ({
    benefitId: args.data.benefitId,
    jobId: args.data.jobId,
  }));

  const mockPrisma = {
    job: {
      update: mockJobUpdate,
      findUnique: mockJobFindUnique,
    },
    compensation: {
      update: mockCompensationUpdate,
    },
    jobAddress: {
      update: mockAddressUpdate,
    },
    jobBenefit: {
      create: mockJobBenefitCreate,
      findUnique: mockJobBenefitFindUnique,
    },
    benefit: {
      findUnique: mockFindBenefit,
      create: mockCreateBenefit,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should update job compensation", async () => {
    await updateJob({
      title: "Software Engineer",
      userId: "user123",
      company: mockCompany,
      workMode: WorkMode.remote,
      compensation: {
        payAmount: 100000,
      },
    });

    expect(mockCompensationUpdate).toHaveBeenCalled();

    expect(mockCompensationUpdate).toHaveBeenCalledWith({
      where: {
        jobId: 1,
      },
      data: {
        payAmount: 100000,
        payFrequency: undefined,
        currency: undefined,
        salaryRangeMin: undefined,
        salaryRangeMax: undefined,
        hoursWeek: undefined,
        negotiable: undefined,
      },
    });
  });

  test("should update job address", async () => {
    await updateJob({
      title: "Software Engineer",
      userId: "user123",
      company: mockCompany,
      workMode: WorkMode.remote,
      address: {
        streetAddress: "123 Tech Lane",
        city: "Innovation City",
        state: "CA",
        postalCode: "90001",
        country: "USA",
      },
    });

    expect(mockAddressUpdate).toHaveBeenCalled();

    expect(mockAddressUpdate).toHaveBeenCalledWith({
      where: {
        jobId: 1,
      },
      data: {
        streetAddress: "123 Tech Lane",
        city: "Innovation City",
        state: "CA",
        postalCode: "90001",
        country: "USA",
      },
    });
  });

  test("should add benefits to the job", async () => {
    await updateJob({
      title: "Software Engineer",
      userId: "user123",
      company: mockCompany,
      workMode: WorkMode.remote,
      benefits: ["Health Insurance", "Equity"],
    });

    expect(mockJobBenefitCreate).toHaveBeenCalled();
    // it does not create the existing job benefit
    expect(mockJobBenefitCreate).not.toHaveBeenCalledWith({
      data: {
        jobId: 1,
        benefitId: 1,
      },
    });
    expect(mockJobBenefitCreate).toHaveBeenCalledWith({
      data: {
        jobId: 1,
        benefitId: 2,
      },
    });
  });

  test("should update job responsibilities", async () => {
    await updateJob({
      title: "Software Engineer",
      userId: "user123",
      company: mockCompany,
      workMode: WorkMode.remote,
      responsibilities: ["Develop software", "Review code"],
    });

    expect(mockJobUpdate).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        responsibilities: {
          set: ["Existing responsibility", "Develop software", "Review code"],
        },
      },
    });
  });

  test("should update job title and work mode", async () => {
    await updateJob({
      title: "Software Engineer",
      userId: "user123",
      company: mockCompany,
      workMode: WorkMode.remote,
      newTitle: "Senior Software Engineer",
      newWorkMode: WorkMode.onsite,
    });

    expect(mockJobUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        title: "Senior Software Engineer",
        workMode: WorkMode.onsite,
      },
    });
  });

  test("should throw an error if only a salary range min is provided", async () => {
    await expect(
      updateJob({
        title: "Software Engineer",
        userId: "user123",
        company: mockCompany,
        workMode: WorkMode.remote,
        compensation: {
          salaryRangeMin: 100000,
        },
      })
    ).rejects.toThrow(
      "You must provide both salaryRangeMin and salaryRangeMax"
    );
  });
});
