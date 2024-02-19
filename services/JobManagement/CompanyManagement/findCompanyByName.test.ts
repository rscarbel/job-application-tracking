import { test, expect, mock, describe } from "bun:test";
import { findCompanyByName } from "./findCompanyByName";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("findCompanyByName", () => {
  interface Company {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const mockPrisma = {
    company: {
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

  test("should return the correct company for a given user", async () => {
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
    expectToHaveBeenCalledWith(mockPrisma.company.findUnique, {
      where: {
        name_userId: {
          name: "East Indian Trading Company",
          userId: "user123",
        },
      },
    });
  });
});
