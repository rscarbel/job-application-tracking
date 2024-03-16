import { test, expect, mock, describe } from "bun:test";
import { addTagToApplication } from "./addTagToApplication";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("addTagToApplication", () => {
  const foundApplicationTag = {
    id: 1,
    value: "exciting",
    userId: "user123",
  };

  const newBenefit = {
    id: 2,
    value: "boring",
    userId: "user123",
  };

  const applicationId = 1;

  const mockApplicationApplicationTagFindUnique = mock(
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

  const mockApplicationApplicationFindUnique = mock(
    async ({
      where: {
        tagId_applicationId: { applicationId, tagId },
      },
    }) => {
      const applicationIdMatches = applicationId === 1;
      const tagIdMatches = tagId === foundApplicationTag.id;
      const isFound = applicationIdMatches && tagIdMatches;

      return isFound ? { applicationId, tagId } : null;
    }
  );

  const mockCreateApplicationTag = mock(async (data) => newBenefit);

  const mockPrisma = {
    applicationApplicationTag: {
      create: mock(async (args) => ({
        tagId: args.data.tagId,
        applicationId: args.data.applicationId,
      })),
      findUnique: mockApplicationApplicationFindUnique,
    },
    applicationTag: {
      findUnique: mockApplicationApplicationTagFindUnique,
      create: mockCreateApplicationTag,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("addTagToApplication associates an existing benefit with a job", async () => {
    const value = "exciting";
    const userId = "user123";

    const result = await addTagToApplication({
      value,
      userId,
      applicationId,
    });

    expect(result).toMatchObject({
      tagId: foundApplicationTag.id,
      applicationId,
    });
  });

  test("addTagToApplication creates and associates a new benefit with a job when benefit does not exist", async () => {
    const value = "boring";
    const userId = "user123";

    await addTagToApplication({
      value,
      userId,
      applicationId,
    });

    expectToHaveBeenCalledWith(mockPrisma.applicationApplicationTag.create, {
      data: {
        applicationId,
        tagId: newBenefit.id,
      },
    });
  });
});
