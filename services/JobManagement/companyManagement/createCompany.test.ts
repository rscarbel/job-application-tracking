import { test, expect, mock } from "bun:test";
import { CompanyType, CompanySize } from "@prisma/client";

interface CompanyWithDetails {
  id: number;
  name: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  details?: {
    culture?: string;
    industry?: string;
    size?: CompanySize;
    website?: string;
    type?: CompanyType;
    history?: string;
    mission?: string;
    vision?: string;
    values?: string;
    description?: string;
  };
}

const createdCompany = {
  id: 1,
  name: "new company",
  userId: "userId1234",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  company: {
    create: mock(async (data) => {
      return { ...createdCompany, details: data.data.details.create };
    }),
  },
};

mock.module("@/services/globalPrismaClient", () => {
  return { default: mockPrisma };
});

import { createCompany } from ".";

test("createCompany creates a new company", async () => {
  const companyInput = {
    name: "new company",
    userId: "userId1234",
    culture: "a very good company",
    industry: "manufacturing",
    size: CompanySize.MASSIVE,
    website: "www.example.com",
    type: CompanyType.PUBLIC,
    history: "built in 1905",
    mission: "to create the best toothpaste",
    vision: "to see the whole world have clean teeth",
    values: "work hard, brush hard",
    description: "a large manufacturing company producing household products",
  };

  const result: CompanyWithDetails = await createCompany(companyInput);

  expect(mockPrisma.company.create).toHaveBeenCalledWith({
    data: {
      name: companyInput.name,
      userId: companyInput.userId,
      details: {
        create: {
          culture: companyInput.culture,
          industry: companyInput.industry,
          size: companyInput.size,
          website: companyInput.website,
          type: companyInput.type,
          history: companyInput.history,
          mission: companyInput.mission,
          vision: companyInput.vision,
          values: companyInput.values,
          description: companyInput.description,
        },
      },
    },
  });

  const expectedDetails = {
    culture: companyInput.culture,
    industry: companyInput.industry,
    size: companyInput.size,
    website: companyInput.website,
    type: companyInput.type,
    history: companyInput.history,
    mission: companyInput.mission,
    vision: companyInput.vision,
    values: companyInput.values,
    description: companyInput.description,
  };

  expect(result).toEqual({
    ...createdCompany,
    details: expectedDetails,
  });

  expect(result.details).toEqual(expectedDetails);
});
