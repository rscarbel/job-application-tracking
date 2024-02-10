import { test, expect, mock, describe, beforeAll, afterAll } from "bun:test";
import { addBenefitToJob } from ".";

describe("addBenefitToJob", () => {
  const foundBenefit = {
    id: 1,
    name: "Health Insurance",
    userId: "user123",
  };

  const newBenefit = {
    id: 2,
    name: "Dental Insurance",
    userId: "user123",
  };

  const jobId = 1;

  const originalMockFindBenefitByName = mock(async (data) => {
    if (data.where.name === foundBenefit.name) return foundBenefit;

    return null;
  });

  const mockCreateBenefit = mock(async (data) => newBenefit);

  const mockPrisma = {
    jobBenefit: {
      create: mock(async (args) => ({
        benefitId: args.data.benefitId,
        jobId: args.data.jobId,
      })),
    },
    benefit: {
      findFirst: originalMockFindBenefitByName,
      create: mockCreateBenefit,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("addBenefitToJob associates an existing benefit with a job", async () => {
    const benefitName = "Health Insurance";
    const userId = "user123";

    const result = await addBenefitToJob({
      benefitName,
      userId,
      jobId,
    });

    console.log(result);

    expect(result).toMatchObject({
      benefitId: foundBenefit.id,
      jobId,
    });
  });

  test("addBenefitToJob creates and associates a new benefit with a job when benefit does not exist", async () => {
    const benefitName = "Dental Insurance";
    const userId = "user123";

    await addBenefitToJob({
      benefitName,
      userId,
      jobId,
    });

    expect(mockPrisma.jobBenefit.create).toHaveBeenCalledWith({
      data: {
        jobId,
        benefitId: newBenefit.id,
      },
    });
  });
});
