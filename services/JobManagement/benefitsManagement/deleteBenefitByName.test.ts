import { test, expect, mock } from "bun:test";

const foundBenefit = {
  id: 1,
  name: "Health Insurance",
  userId: "user123",
};

const mockFindBenefitByName = mock(async () => foundBenefit);

const mockPrisma = {
  benefit: {
    delete: mock(async () => ({
      id: foundBenefit.id,
      name: foundBenefit.name,
      userId: foundBenefit.userId,
    })),
    findFirst: mockFindBenefitByName,
  },
};

mock.module("@/services/globalPrismaClient", () => {
  return { default: mockPrisma };
});

import { deleteBenefitByName } from ".";

test("deleteBenefitByName deletes a benefit for a given user", async () => {
  const benefitName = "Health Insurance";
  const userId = "user123";

  await deleteBenefitByName({
    benefitName,
    userId,
  });

  expect(mockFindBenefitByName).toHaveBeenCalledTimes(1);

  expect(mockPrisma.benefit.delete).toHaveBeenCalledWith({
    where: {
      name_userId: {
        name: benefitName,
        userId: userId,
      },
    },
  });
});
