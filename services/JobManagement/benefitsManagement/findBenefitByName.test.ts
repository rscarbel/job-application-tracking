import { test, expect, mock } from "bun:test";

interface Benefit {
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockPrisma = {
  benefit: {
    findUnique: mock(
      ({
        where: {
          name_userId: { name, userId },
        },
      }) =>
        Promise.resolve({
          id: 1,
          name,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    ),
  },
};

mock.module("@/services/globalPrismaClient", () => {
  return { default: mockPrisma };
});

import { findBenefitByName } from "./findBenefitByName";

test("findBenefitByName returns the correct benefit for a given user", async () => {
  const expectedBenefit: Benefit = {
    id: 1,
    name: "Health Insurance",
    userId: "user123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await findBenefitByName({
    benefitName: "Health Insurance",
    userId: "user123",
  });

  expect(result).toEqual(expectedBenefit);
  expect(mockPrisma.benefit.findUnique).toHaveBeenCalled();
  expect(mockPrisma.benefit.findUnique).toHaveBeenCalledWith({
    where: {
      name_userId: {
        name: "Health Insurance",
        userId: "user123",
      },
    },
  });
});
