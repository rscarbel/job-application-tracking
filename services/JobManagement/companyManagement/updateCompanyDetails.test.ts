import { test, expect, mock, beforeEach, describe } from "bun:test";
import { CompanySize, CompanyType } from "@prisma/client";
import { updateCompanyDetails } from "./updateCompanyDetails";

describe("updateCompanyDetails", () => {
  let mockPrisma: any;

  const foundCompany = {
    id: 1,
    name: "The Empire",
    userId: "darthVader123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    const mockUpdate = mock(
      async ({
        where: { companyId },
        data: {
          culture,
          industry,
          size,
          website,
          type,
          history,
          mission,
          vision,
          values,
          description,
        },
      }) => {
        return {
          companyId,
          culture,
          industry,
          size,
          website,
          type,
          history,
          mission,
          vision,
          values,
          description,
        };
      }
    );

    mockPrisma = {
      companyDetail: {
        update: mockUpdate,
      },
    };

    mock.module("@/services/globalPrismaClient", () => {
      return { default: mockPrisma };
    });
  });

  test("should the correct company for a given user", async () => {
    const updateCompanyArgs = {
      company: foundCompany,
      culture: "Dark Side",
      industry: "Galactic Empire",
      size: CompanySize.MASSIVE,
      website: "www.empire.com",
      type: CompanyType.GOVERNMENT_AGENCY,
      history: "Founded by Darth Sidious",
      mission: "To bring peace to the galaxy",
      vision: "To rule the galaxy",
      values: "Power, control, order",
      description: "A galaxy-spanning government",
    };

    await updateCompanyDetails(updateCompanyArgs);

    expect(mockPrisma.companyDetail.update).toHaveBeenCalled();
    expect(mockPrisma.companyDetail.update).toHaveBeenCalledWith({
      where: {
        companyId: 1,
      },
      data: {
        culture: "Dark Side",
        industry: "Galactic Empire",
        size: CompanySize.MASSIVE,
        website: "www.empire.com",
        type: CompanyType.GOVERNMENT_AGENCY,
        history: "Founded by Darth Sidious",
        mission: "To bring peace to the galaxy",
        vision: "To rule the galaxy",
        values: "Power, control, order",
        description: "A galaxy-spanning government",
      },
    });
  });
});
