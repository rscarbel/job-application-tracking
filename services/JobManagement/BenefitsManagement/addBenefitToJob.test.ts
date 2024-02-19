import { test, expect, mock, describe } from "bun:test";
import { addBenefitToJob } from "./addBenefitToJob";
import { expectToHaveBeenCalledWith } from "@/testHelper";

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

  const mockBenefitFindUnique = mock(
    async ({
      where: {
        name_userId: { name, userId },
      },
    }) => {
      const nameMatches = name === foundBenefit.name;
      const userIdMatches = userId === foundBenefit.userId;
      const isFound = nameMatches && userIdMatches;

      return isFound ? foundBenefit : null;
    }
  );

  const mockJobBenefitUnique = mock(
    async ({
      where: {
        jobId_benefitId: { jobId, benefitId },
      },
    }) => {
      const jobIdMatches = jobId === 1;
      const benefitIdMatches = benefitId === foundBenefit.id;
      const isFound = jobIdMatches && benefitIdMatches;

      return isFound ? { jobId, benefitId } : null;
    }
  );

  const mockCreateBenefit = mock(async (data) => newBenefit);

  const mockPrisma = {
    jobBenefit: {
      create: mock(async (args) => ({
        benefitId: args.data.benefitId,
        jobId: args.data.jobId,
      })),
      findUnique: mockJobBenefitUnique,
    },
    benefit: {
      findUnique: mockBenefitFindUnique,
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

    expectToHaveBeenCalledWith(mockPrisma.jobBenefit.create, {
      data: {
        jobId,
        benefitId: newBenefit.id,
      },
    });
  });
});
