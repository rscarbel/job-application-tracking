import { test, expect, mock, describe } from "bun:test";
import { deleteApplicationTagByValue } from "./deleteApplicationTagByValue";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("deleteApplicationTagByValue", () => {
  const foundTag = {
    id: 1,
    value: "exciting",
    userId: "user123",
  };

  const mockFindUnique = mock(
    async ({
      where: {
        value_userId: { value, userId },
      },
    }) => {
      const valueMatches = value === foundTag.value;
      const userIdMatches = userId === foundTag.userId;
      const isFound = valueMatches && userIdMatches;

      return isFound ? foundTag : null;
    }
  );

  const mockPrisma = {
    applicationTag: {
      delete: mock(
        async ({
          where: {
            value_userId: { value, userId },
          },
        }) => ({
          id: foundTag.id,
          value,
          userId,
        })
      ),
      findUnique: mockFindUnique,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should delete a applicationTag for a given user", async () => {
    const applicationTagName = "exciting";
    const userId = "user123";

    await deleteApplicationTagByValue({
      value: applicationTagName,
      userId,
    });

    expect(mockFindUnique).toHaveBeenCalled();

    expectToHaveBeenCalledWith(mockPrisma.applicationTag.delete, {
      where: {
        value_userId: {
          value: applicationTagName,
          userId: userId,
        },
      },
    });
  });

  test("should return null if no applicationTag is found", async () => {
    const applicationTagName = "nonsense value";
    const userId = "user123";

    const result = await deleteApplicationTagByValue({
      value: applicationTagName,
      userId,
    });

    expect(mockFindUnique).toHaveBeenCalled();

    expect(mockPrisma.applicationTag.delete).not.toHaveBeenCalledWith({
      where: {
        value_userId: {
          value: applicationTagName,
          userId: userId,
        },
      },
    });

    expect(result).toBeNull();
  });
});
