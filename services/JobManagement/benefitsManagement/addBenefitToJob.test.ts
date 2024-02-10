import { test, expect, mock } from "bun:test";

const foundBenefit = {
  id: 1,
  name: "Health Insurance",
  userId: "user123",
};

const jobId = 1;

const mockFindBenefitByName = mock(async () => foundBenefit);

const mockPrisma = {
  jobBenefit: {
    create: mock(async () => ({
      id: foundBenefit.id,
      name: foundBenefit.name,
      userId: foundBenefit.userId,
    })),
  },
};

mock.module("./findBenefitByName", () => {
  return { findBenefitByName: mockFindBenefitByName };
});

mock.module("@/services/globalPrismaClient", () => {
  return { default: mockPrisma };
});

import { addBenefitToJob } from ".";

test("addBenefitToJob associates a benefit with a job", async () => {
  const benefitName = "Health Insurance";
  const userId = "user123";

  await addBenefitToJob({
    benefitName,
    userId,
    jobId,
  });

  expect(mockFindBenefitByName).toHaveBeenCalledWith({
    benefitName,
    userId,
    client: mockPrisma,
  });

  expect(mockPrisma.jobBenefit.create).toHaveBeenCalledWith({
    data: {
      jobId,
      benefitId: foundBenefit.id,
    },
  });
});
