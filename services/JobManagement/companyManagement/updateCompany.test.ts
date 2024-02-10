import { test, expect, mock } from "bun:test";

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

import { updateCompany } from "./updateCompany";

test("updateCompany returns the correct company for a given user", async () => {
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
