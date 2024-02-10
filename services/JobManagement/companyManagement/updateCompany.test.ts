import { test, expect, mock } from "bun:test";

const mockPrisma = {
  company: {
    update: mock(({ where: { id }, data: { name, userId } }) =>
      Promise.resolve({
        id,
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

import { updateCompany } from "./updateCompany";

test("updateCompany returns the correct company for a given user", async () => {
  const expectedCompany = {
    id: 1,
    name: "The Empire",
    userId: "darthVader123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await updateCompany({
    companyId: 1,
    name: "The Empire",
    userId: "darthVader123",
  });

  expect(result).toEqual(expectedCompany);
  expect(mockPrisma.company.update).toHaveBeenCalled();
  expect(mockPrisma.company.update).toHaveBeenCalledWith({
    where: {
      id: 1,
    },
    data: {
      name: "The Empire",
      userId: "darthVader123",
    },
  });
});
