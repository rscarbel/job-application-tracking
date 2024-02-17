import { test, expect, mock, describe } from "bun:test";
import { deleteJob } from "./deleteJob";
import { WorkMode } from "@prisma/client";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("deleteJob", () => {
  const existingJob = {
    id: 1,
    title: "pirate",
    userId: "user123",
    responsibilities: [],
    description: "A pirate's life for me",
    workMode: WorkMode.REMOTE,
    companyId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrisma = {
    job: {
      delete: mock(async ({ where: { id } }) => ({
        id: existingJob.id,
      })),
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should delete a job", async () => {
    await deleteJob({ job: existingJob });

    expectToHaveBeenCalledWith(mockPrisma.job.delete, {
      where: {
        id: existingJob.id,
      },
    });
  });
});
