import { test, expect, mock } from "bun:test";

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
  benefit: {
    delete: mock(
      async ({
        where: {
          name_userId: { name, userId },
        },
      }) => ({
        id: foundBenefit.id,
        name,
        userId,
      })
    ),
    findUnique: mockFindUnique,
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

  expect(mockFindUnique).toHaveBeenCalled();

  expect(mockPrisma.benefit.delete).toHaveBeenCalledWith({
    where: {
      name_userId: {
        name: benefitName,
        userId: userId,
      },
    },
  });
});

test("deleteBenefitByName returns null if no benefit is found", async () => {
  const benefitName = "nonsense name";
  const userId = "user123";

  const result = await deleteBenefitByName({
    benefitName,
    userId,
  });

  expect(mockFindUnique).toHaveBeenCalled();

  expect(mockPrisma.benefit.delete).not.toHaveBeenCalledWith({
    where: {
      name_userId: {
        name: benefitName,
        userId: userId,
      },
    },
  });

  expect(result).toBeNull();
});