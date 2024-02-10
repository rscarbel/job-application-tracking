import { test, expect, mock } from "bun:test";

interface Company {
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockPrisma = {
  company: {
    findUnique: mock(() =>
      Promise.resolve({
        id: 1,
        name: "East Indian Trading Company",
        userId: "user123",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ),
  },
};

mock.module("@/services/globalPrismaClient", () => {
  return { default: mockPrisma };
});

import { findCompanyByName } from ".";

test("findCompanyByName returns the correct company for a given user", async () => {
  const expectedCompany: Company = {
    id: 1,
    name: "East Indian Trading Company",
    userId: "user123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await findCompanyByName({
    name: "East Indian Trading Company",
    userId: "user123",
  });

  expect(result).toEqual(expectedCompany);
  expect(mockPrisma.company.findUnique).toHaveBeenCalled();
  expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({
    where: {
      name_userId: {
        name: "East Indian Trading Company",
        userId: "user123",
      },
    },
  });
});
