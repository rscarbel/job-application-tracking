import { test, expect, mock, beforeEach, describe } from "bun:test";
import { CompanySize, CompanyType } from "@prisma/client";
import { updateCompanyDetails } from "./updateCompanyDetails";

describe("updateCompanyDetails", () => {
  let mockPrisma: any;

  beforeEach(() => {
    const foundCompany = {
      id: 1,
      name: "The Empire",
      userId: "darthVader123",
    };

    const mockFindUnique = mock(
      async ({
        where: {
          name_userId: { name, userId },
        },
      }) => {
        const nameMatches = name === foundCompany.name;
        const userIdMatches = userId === foundCompany.userId;
        const isFound = nameMatches && userIdMatches;

        return isFound ? foundCompany : null;
      }
    );

    const mockUpdate = mock(
      async ({
        where: { id },
        data: {
          details: {
            update: {
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
          },
        },
        include: { details },
      }) => {
        return {
          id,
          name: foundCompany.name,
          userId: foundCompany.userId,
          details: {
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
        };
      }
    );

    mockPrisma = {
      company: {
        findUnique: mockFindUnique,
        update: mockUpdate,
      },
    };

    mock.module("@/services/globalPrismaClient", () => {
      return { default: mockPrisma };
    });
  });

  test("should the correct company for a given user", async () => {
    const updateCompanyArgs = {
      name: "The Empire",
      userId: "darthVader123",
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

    expect(mockPrisma.company.findUnique).toHaveBeenCalled();
    expect(mockPrisma.company.update).toHaveBeenCalled();
    expect(mockPrisma.company.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        details: {
          update: {
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
        },
      },
      include: {
        details: true,
      },
    });
  });

  test("should throw an error when no company is found", async () => {
    const updateCompanyArgs = {
      name: "nonsense name",
      userId: "darthVader123",
    };

    await expect(updateCompanyDetails(updateCompanyArgs)).rejects.toThrow(
      "Company not found"
    );

    expect(mockPrisma.company.update).not.toHaveBeenCalled();
  });
});
