import { test, mock, describe } from "bun:test";
import { deleteCompany } from "./deleteCompany";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("deleteCompany", () => {
  const foundCompany = {
    id: 1,
    name: "East Indian Trading Company",
    userId: "user123",
  };

  const mockPrisma = {
    company: {
      delete: mock(
        async ({
          where: {
            name_userId: { name, userId },
          },
        }) => ({
          id: foundCompany.id,
          name,
          userId,
        })
      ),
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should delete a company for a given user", async () => {
    const companyName = "East Indian Trading Company";
    const userId = "user123";

    await deleteCompany({
      name: companyName,
      userId,
    });

    expectToHaveBeenCalledWith(mockPrisma.company.delete, {
      where: {
        name_userId: {
          name: companyName,
          userId: userId,
        },
      },
    });
  });
});
