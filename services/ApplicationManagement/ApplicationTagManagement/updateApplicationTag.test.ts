import { test, expect, mock, describe, afterEach } from "bun:test";
import { updateApplicationTag } from "./updateApplicationTag";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("updateApplicationTag", () => {
  interface UpdateResponse {
    id: number;
    value: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const mockPrisma = {
    applicationTag: {
      update: mock(() =>
        Promise.resolve({
          id: 1,
          value: "exciting",
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

  afterEach(() => {
    mockPrisma.applicationTag.update.mockClear();
  });

  test("should update a applicationTag's value for a given user", async () => {
    const oldValue = "boring";
    const newValue = "exciting";
    const userId = "user123";
    const expectedUpdateResponse: UpdateResponse = {
      id: 1,
      value: newValue,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await updateApplicationTag({
      value: oldValue,
      newValue: newValue,
      userId: userId,
    });

    expect(result).toEqual(expectedUpdateResponse);
    expect(mockPrisma.applicationTag.update).toHaveBeenCalled();
    expectToHaveBeenCalledWith(mockPrisma.applicationTag.update, {
      where: {
        value_userId: {
          value: oldValue,
          userId: userId,
        },
      },
      data: {
        value: newValue,
      },
    });
  });
});
