import { test, mock, describe } from "bun:test";
import { deleteApplication } from "./deleteApplication";
import { expectToHaveBeenCalledWith } from "@/testHelper";
import { ApplicationStatus } from "@prisma/client";

describe("deleteApplication", () => {
  const existingApplication = {
    id: 1,
    userId: "user123",
    jobId: 1,
    status: ApplicationStatus.APPLIED,
    applicationDate: new Date(),
    applicationLink: "www.example.com",
    notes: "I hope you get the job",
    applicationGroupId: 1,
    positionIndex: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrisma = {
    application: {
      delete: mock(async ({ where: { id, userId } }) => ({
        id: existingApplication.id,
        userId: existingApplication.userId,
      })),
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should delete a application", async () => {
    await deleteApplication({
      application: existingApplication,
      userId: existingApplication.userId,
    });

    expectToHaveBeenCalledWith(mockPrisma.application.delete, {
      where: {
        id: existingApplication.id,
        userId: existingApplication.userId,
      },
    });
  });
});
