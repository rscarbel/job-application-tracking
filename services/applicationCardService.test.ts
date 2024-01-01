import prisma from "./globalPrismaClient";
import { describe, expect, test, beforeEach, beforeAll } from "bun:test";
import { getFormattedCardData } from "./applicationService";

describe("Application Services", () => {
  describe("getFormattedCardData", () => {
    test("should throw an error when the application card is not found", async () => {
      const applicationId = 1;
      const userId = "user-id";

      expect(async () => {
        await getFormattedCardData({
          applicationId,
          userId,
        });
      }).toThrow("Application Card not found");
    });

    // test("should throw an error when the user is unauthorized", async () => {
    //   const applicationId = 1;
    //   const userId = "unauthorized-user-id";

    //   const result = await getFormattedCardData({
    //     applicationId,
    //     userId,
    //   });

    //   await expect(result).toThrow("Unauthorized");
    // });

    // test("should return the formatted card data when the application card is found and the user is authorized", async () => {
    //   const data = await getFormattedCardData({ applicationId, userId });

    //   expect(data).toBeDefined();
    //   expect(data.applicationId).toBe(applicationId);
    //   expect(data.groupId).toBeDefined();
    //   expect(data.jobId).toBeDefined();
    //   expect(data.company).toBeDefined();
    // });
  });
});
