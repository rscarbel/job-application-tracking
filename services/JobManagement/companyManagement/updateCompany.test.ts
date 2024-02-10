import { test, expect, mock, describe } from "bun:test";
import { updateCompany } from "./updateCompany";

describe("updateCompany", () => {
  const mockUpdate = mock(
    async ({ where: { id }, data: { name, userId }, include: { details } }) => {
      return {
        id,
        name: name,
        userId,
      };
    }
  );

  const mockPrisma = {
    company: {
      update: mockUpdate,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should update the company with the new name", async () => {
    await updateCompany({
      companyId: 1,
      name: "The Empire",
      userId: "darthVader123",
    });

    expect(mockPrisma.company.update).toHaveBeenCalled();
    expect(mockPrisma.company.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        name: "The Empire",
        userId: "darthVader123",
      },
      include: {
        details: true,
      },
    });
  });
});
