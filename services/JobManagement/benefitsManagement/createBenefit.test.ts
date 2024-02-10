import { test, expect, mock } from "bun:test";

const createdBenefit = {
  id: 1,
  name: "Health Insurance",
  userId: "user123",
};

const mockPrisma = {
  benefit: {
    create: mock(async () => ({
      name: createdBenefit.name,
      userId: createdBenefit.userId,
    })),
  },
};

mock.module("@/services/globalPrismaClient", () => {
  return { default: mockPrisma };
});

import { createBenefit } from ".";

test("createBenefit creates a new benefit associated with a user", async () => {
  const benefitName = "Health Insurance";
  const userId = "user123";

  await createBenefit({
    name: benefitName,
    userId,
  });

  expect(mockPrisma.benefit.create).toHaveBeenCalledWith({
    data: {
      name: benefitName,
      userId: userId,
    },
  });
});
