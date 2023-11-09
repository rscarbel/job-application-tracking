import prisma from "./globalPrismaClient";
import { describe, expect, test, beforeEach, beforeAll } from "bun:test";
import { getFormattedCardData } from "./applicationCardService";

describe("Application Services", () => {
  describe("getFormattedCardData", () => {
    test("should throw an error when the application card is not found", async () => {
      const applicationCardId = 1;
      const userId = "user-id";

      expect(async () => {
        await getFormattedCardData({
          applicationCardId,
          userId,
        });
      }).toThrow("Application Card not found");
    });

    // test("should throw an error when the user is unauthorized", async () => {
    //   const applicationCardId = 1;
    //   const userId = "unauthorized-user-id";

    //   const result = await getFormattedCardData({
    //     applicationCardId,
    //     userId,
    //   });

    //   await expect(result).toThrow("Unauthorized");
    // });

    // test("should return the formatted card data when the application card is found and the user is authorized", async () => {
    //   const data = await getFormattedCardData({ applicationCardId, userId });

    //   expect(data).toBeDefined();
    //   expect(data.cardId).toBe(applicationCardId);
    //   expect(data.boardId).toBeDefined();
    //   expect(data.jobId).toBeDefined();
    //   expect(data.company).toBeDefined();
    // });
  });
});
