import { test, expect, mock, describe } from "bun:test";
import { removeBenefitFromJob } from "./removeBenefitFromJob";

describe("removeBenefitFromJob", () => {
  const foundBenefit = {
    id: 1,
    name: "Health Insurance",
    userId: "user123",
  };

  const mockFindUnique = mock(
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

  const mockPrisma = {
    jobBenefit: {
      delete: mock(async () => ({
        benefitId: foundBenefit.id,
        jobId: 1,
      })),
    },
    benefit: {
      findUnique: mockFindUnique,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should disassociate a benefit from a job", async () => {
    const benefitName = "Health Insurance";
    const jobId = 1;
    const userId = "user123";

    await removeBenefitFromJob({
      benefitName,
      userId,
      jobId,
    });

    expect(mockPrisma.jobBenefit.delete).toHaveBeenCalledWith({
      where: {
        jobId_benefitId: {
          benefitId: foundBenefit.id,
          jobId: jobId,
        },
      },
    });
  });
});
