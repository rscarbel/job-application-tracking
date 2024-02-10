import { test, expect, mock, describe } from "bun:test";
import { editBenefit } from "./editBenefit";

describe("editBenefit", () => {
  interface UpdateResponse {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const mockPrisma = {
    benefit: {
      update: mock(() =>
        Promise.resolve({
          id: 1,
          name: "Dental Insurance",
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

  test("should update a benefit's name for a given user", async () => {
    const oldName = "Health Insurance";
    const newName = "Dental Insurance";
    const userId = "user123";
    const expectedUpdateResponse: UpdateResponse = {
      id: 1,
      name: newName,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await editBenefit({
      name: oldName,
      newName: newName,
      userId: userId,
    });

    expect(result).toEqual(expectedUpdateResponse);
    expect(mockPrisma.benefit.update).toHaveBeenCalled();
    expect(mockPrisma.benefit.update).toHaveBeenCalledWith({
      where: {
        name_userId: {
          name: oldName,
          userId: userId,
        },
      },
      data: {
        name: newName,
      },
    });
  });
});
