import { test, expect, mock, beforeEach, describe } from "bun:test";
import { PayFrequency } from "@prisma/client";
import { updateCompensation } from "./updateCompensation";

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
      payFrequency: PayFrequency.yearly,
      currency: "USD",
      salaryRangeMin: 100000,
      salaryRangeMax: 150000,
      hoursWeek: 40,
      negotiable: true,
    };

    const result = await updateCompensation(compensationDetails);

    expect(result).toEqual({
      id: 1,
      jobId: 1,
      payAmount: 120000,
      payFrequency: PayFrequency.yearly,
      currency: "USD",
      salaryRangeMin: 100000,
      salaryRangeMax: 150000,
      hoursWeek: 40,
      negotiable: true,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    expect(mockPrisma.compensation.update).toHaveBeenCalledWith({
      where: {
        jobId: 1,
      },
      data: {
        payAmount: 120000,
        payFrequency: PayFrequency.yearly,
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
      payFrequency: PayFrequency.yearly,
      currency: "USD",
      salaryRangeMin: 100000,
      salaryRangeMax: 150000,
      negotiable: true,
    };

    const result = await updateCompensation(compensationDetails);

    expect(result).toBeNull();
    expect(mockPrisma.compensation.update).toHaveBeenCalledWith({
      where: {
        jobId: 314159265358979,
      },
      data: {
        payAmount: 120000,
        payFrequency: PayFrequency.yearly,
        currency: "USD",
        salaryRangeMin: 100000,
        salaryRangeMax: 150000,
        negotiable: true,
      },
    });
  });
});
