import { test, expect, mock } from "bun:test";

const foundBenefit = {
  id: 1,
  name: "Health Insurance",
  userId: "user123",
};

const mockFindBenefitByName = mock(async () => foundBenefit);

const mockPrisma = {
  jobBenefit: {
    delete: mock(async () => ({
      benefitId: foundBenefit.id,
      jobId: 1,
    })),
  },
};

mock.module("./findBenefitByName", () => {
  return { findBenefitByName: mockFindBenefitByName };
});

mock.module("@/services/globalPrismaClient", () => {
  return { default: mockPrisma };
});

import { removeBenefitFromJob } from ".";

test("removeBenefitFromJob disassociates a benefit froma  job", async () => {
  const benefitName = "Health Insurance";
  const jobId = 1;
  const userId = "user123";

  await removeBenefitFromJob({
    benefitName,
    userId,
    jobId,
  });

  expect(mockFindBenefitByName).toHaveBeenCalledWith({
    benefitName,
    userId,
    client: mockPrisma,
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
