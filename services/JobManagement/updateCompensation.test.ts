import { test, expect, mock, beforeEach, describe } from "bun:test";
import { PayFrequency } from "@prisma/client";
import { updateCompensation } from "./updateCompensation";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("updateCompensation", () => {
  let mockPrisma: any;

  beforeEach(() => {
    const mockCompensationUpdate = mock(
      async ({
        where: { jobId },
        data: {
          payAmount,
          payFrequency,
          currency,
          salaryRangeMin,
          salaryRangeMax,
          hoursWeek,
          negotiable,
          user: {
            connect: { id },
          },
        },
      }) => {
        if (jobId === 1) {
          return {
            payAmount,
            payFrequency,
            currency,
            salaryRangeMin,
            salaryRangeMax,
            hoursWeek,
            negotiable,
            id: 1,
            jobId,
            userId: id,
            updatedAt: new Date(),
            createdAt: new Date(),
          };
        } else {
          return null;
        }
      }
    );

    mockPrisma = {
      compensation: {
        update: mockCompensationUpdate,
      },
    };

    mock.module("@/services/globalPrismaClient", () => {
      return { default: mockPrisma };
    });
  });

  test("should update compensation details for a given job ID", async () => {
    const compensationDetails = {
      id: 1,
      jobId: 1,
      payAmount: 120000,
      payFrequency: PayFrequency.ANNUALLY,
      currency: "USD",
      salaryRangeMin: 100000,
      salaryRangeMax: 150000,
      hoursWeek: 40,
      negotiable: true,
      userId: "user123",
    };

    const result = await updateCompensation(compensationDetails);

    expect(result).toEqual({
      id: 1,
      jobId: 1,
      payAmount: 120000,
      payFrequency: PayFrequency.ANNUALLY,
      currency: "USD",
      salaryRangeMin: 100000,
      salaryRangeMax: 150000,
      hoursWeek: 40,
      negotiable: true,
      userId: "user123",
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    expectToHaveBeenCalledWith(mockPrisma.compensation.update, {
      where: {
        jobId: 1,
      },
      data: {
        payAmount: 120000,
        payFrequency: PayFrequency.ANNUALLY,
        currency: "USD",
        salaryRangeMin: 100000,
        salaryRangeMax: 150000,
        hoursWeek: 40,
        negotiable: true,
      },
    });
  });

  test("should not update any records if job ID does not exist", async () => {
    const compensationDetails = {
      jobId: 314159265358979,
      payAmount: 120000,
      payFrequency: PayFrequency.ANNUALLY,
      currency: "USD",
      salaryRangeMin: 100000,
      salaryRangeMax: 150000,
      negotiable: true,
      userId: "user123",
    };

    const result = await updateCompensation(compensationDetails);

    expect(result).toBeNull();
    expectToHaveBeenCalledWith(mockPrisma.compensation.update, {
      where: {
        jobId: 314159265358979,
      },
      data: {
        payAmount: 120000,
        payFrequency: PayFrequency.ANNUALLY,
        currency: "USD",
        salaryRangeMin: 100000,
        salaryRangeMax: 150000,
        negotiable: true,
        user: {
          connect: {
            id: "user123",
          },
        },
      },
    });
  });
});
