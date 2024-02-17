import { test, mock, describe, afterEach } from "bun:test";
import { createCompany } from "./createCompany";
import { CompanySize, CompanyType, CompanyDesireability } from "@prisma/client";
import { expectToHaveBeenCalledWith } from "@/testHelper";

describe("createCompany", () => {
  const mockCompanyCreate = mock(async (data) => {
    return {
      ...data,
    };
  });

  const mockPreferencesCreate = mock(async (data) => {
    return {
      ...data,
    };
  });

  const mockDetailsCreate = mock(async (data) => {
    return {
      ...data,
    };
  });

  const mockAddressCreate = mock(async (data) => {
    return {
      ...data,
    };
  });

  const mockPrisma = {
    company: {
      create: mockCompanyCreate,
    },
    companyDetails: {
      create: mockDetailsCreate,
    },
    companyAddress: {
      create: mockAddressCreate,
    },
    companyPreferences: {
      create: mockPreferencesCreate,
    },
    user: {
      connect: mock(async (data) => {
        return {
          ...data,
        };
      }),
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  afterEach(() => {
    mockCompanyCreate.mockClear();
    mockDetailsCreate.mockClear();
    mockAddressCreate.mockClear();
    mockPreferencesCreate.mockClear();
  });

  test("should create a new company with only name and uuid", async () => {
    const companyInput = {
      name: "The Empire",
      userId: "darthVader123",
    };

    await createCompany(companyInput);

    expectToHaveBeenCalledWith(mockPrisma.company.create, {
      data: {
        name: "The Empire",
        user: {
          connect: {
            id: "darthVader123",
          },
        },
        details: {
          create: {
            culture: "",
            industry: "",
            size: "SMALL",
            website: "",
            type: "PUBLIC",
            history: "",
            mission: "",
            vision: "",
            values: "",
            description: "",
          },
        },
        address: {
          create: {
            streetAddress: "",
            streetAddress2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
        },
        preferences: {
          create: {
            desireability: "MEDIUM",
            notes: "",
          },
        },
      },
    });
  });

  test("should create a new company with all details", async () => {
    const companyInput = {
      name: "The Empire",
      userId: "darthVader123",
      details: {
        culture: "Sith",
        industry: "Dark Side",
        size: CompanySize.LARGE,
        website: "www.empire.com",
        type: CompanyType.PRIVATE,
        history: "A long time ago...",
        mission: "Conquer the galaxy",
        vision: "Rule the galaxy",
        values: "Power",
        description: "The Empire is a powerful organization",
      },
      address: {
        streetAddress: "123 Death Star",
        streetAddress2: "Apt 66",
        city: "Coruscant",
        state: "Coruscant",
        postalCode: "12345",
        country: "Galactic Empire",
      },
      preferences: {
        desireability: CompanyDesireability.HIGH,
        notes: "The Empire is a great place to work",
      },
    };

    await createCompany(companyInput);

    expectToHaveBeenCalledWith(mockPrisma.company.create, {
      data: {
        name: "The Empire",
        user: {
          connect: {
            id: "darthVader123",
          },
        },
        details: {
          create: {
            culture: "Sith",
            industry: "Dark Side",
            size: "LARGE",
            website: "www.empire.com",
            type: "PRIVATE",
            history: "A long time ago...",
            mission: "Conquer the galaxy",
            vision: "Rule the galaxy",
            values: "Power",
            description: "The Empire is a powerful organization",
          },
        },
        address: {
          create: {
            streetAddress: "123 Death Star",
            streetAddress2: "Apt 66",
            city: "Coruscant",
            state: "Coruscant",
            postalCode: "12345",
            country: "Galactic Empire",
          },
        },
        preferences: {
          create: {
            desireability: "HIGH",
            notes: "The Empire is a great place to work",
          },
        },
      },
    });
  });
});
