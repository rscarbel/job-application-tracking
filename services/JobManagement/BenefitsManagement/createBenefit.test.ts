import { test, expect, mock, describe } from "bun:test";
import { createBenefit } from "./createBenefit";

describe("createBenefit", () => {
  const createdBenefit = {
    id: 1,
    name: "Health Insurance",
    userId: "user123",
    createdAt: new Date(),
    updatedAt: new Date(),
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

  test("createBenefit creates a new benefit associated with a user", async () => {
    const benefitName = "Health Insurance";
    const userId = "user123";

    const result = await createBenefit({
      name: benefitName,
      userId,
    });

    expect(result.name).toEqual(createdBenefit.name);
    expect(result.userId).toEqual(createdBenefit.userId);
  });
});
