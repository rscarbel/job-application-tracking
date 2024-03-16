import { test, mock, describe } from "bun:test";
import { removeTagFromApplication } from "./removeTagFromApplication";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("removeTagFromApplication", () => {
  const foundApplicationTag = {
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
      const valueMatches = value === foundApplicationTag.value;
      const userIdMatches = userId === foundApplicationTag.userId;
      const isFound = valueMatches && userIdMatches;

      return isFound ? foundApplicationTag : null;
    }
  );

  const mockPrisma = {
    applicationApplicationTag: {
      delete: mock(async () => ({
        tagId: foundApplicationTag.id,
        applicationId: 1,
      })),
    },
    applicationTag: {
      findUnique: mockFindUnique,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should disassociate a applicationTag from a job", async () => {
    const applicationTagName = "exciting";
    const applicationId = 1;
    const userId = "user123";

    await removeTagFromApplication({
      value: applicationTagName,
      userId,
      applicationId,
    });

    expectToHaveBeenCalledWith(mockPrisma.applicationApplicationTag.delete, {
      where: {
        tagId_applicationId: {
          tagId: foundApplicationTag.id,
          applicationId: applicationId,
        },
      },
    });
  });
});
