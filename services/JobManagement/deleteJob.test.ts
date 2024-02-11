import { test, expect, mock, describe } from "bun:test";
import { deleteJob } from "./deleteJob";
import { WorkMode } from "@prisma/client";

describe("deleteJob", () => {
  const existingJob = {
    id: 1,
    title: "pirate",
    userId: "user123",
    responsibilities: [],
    description: "A pirate's life for me",
    workMode: WorkMode.remote,
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

    expect(mockPrisma.job.delete).toHaveBeenCalledWith({
      where: {
        id: existingJob.id,
      },
    });
  });
});
