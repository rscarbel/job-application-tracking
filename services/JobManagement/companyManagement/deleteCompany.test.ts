import { test, expect, mock, describe } from "bun:test";
import { deleteCompany } from "./deleteCompany";

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

    expect(mockPrisma.company.delete).toHaveBeenCalledWith({
      where: {
        name_userId: {
          name: companyName,
          userId: userId,
        },
      },
    });
  });
});
