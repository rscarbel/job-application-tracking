import { test, expect, mock, describe } from "bun:test";
import { updateCompany } from "./updateCompany";
import { CompanySize, CompanyType, CompanyDesireability } from "@prisma/client";

describe("updateCompany", () => {
  const mockCompanyUpdate = mock(async ({ where: { id }, data: { name } }) => {
    return {
      id,
      name,
    };
  });

  const mockDetailUpdate = mock(
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

  const mockAddressUpdate = mock(
    async ({
      where: { companyId },
      data: { streetAddress, streetAddress2, city, state, postalCode, country },
    }) => ({
      companyId,
      address: {
        streetAddress,
        streetAddress2,
        city,
        state,
        postalCode,
        country,
      },
    })
  );

  const mockPreferencesUpdate = mock(
    async ({ where: { companyId }, data: { desireability, notes } }) => ({
      companyId,
      desireability,
      notes,
    })
  );

  const mockCompanyFindUnique = mock(
    async ({
      where: {
        name_userId: { name, userId },
      },
    }) => ({
      id: 1,
      name,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  );

  const mockPrisma = {
    company: {
      update: mockCompanyUpdate,
      findUnique: mockCompanyFindUnique,
    },
    companyPreference: {
      update: mockPreferencesUpdate,
    },
    companyDetail: {
      update: mockDetailUpdate,
    },
    companyAddress: {
      update: mockAddressUpdate,
    },
  };

  mock.module("@/services/globalPrismaClient", () => {
    return { default: mockPrisma };
  });

  test("should update the company with the new name", async () => {
    await updateCompany({
      name: "The Empire",
      newName: "The Galactic Empire",
      userId: "darthVader123",
    });

    expect(mockPrisma.company.update).toHaveBeenCalled();
    expect(mockPrisma.company.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        name: "The Galactic Empire",
      },
    });
  });

  test("should update the company with the new details", async () => {
    const updateCompanyArgs = {
      name: "The Empire",
      userId: "darthVader123",
      details: {
        culture: "Dark Side",
        industry: "Galactic Empire",
        size: CompanySize.MASSIVE,
        website: "www.empire.com",
        type: CompanyType.GOVERNMENT_AGENCY,
        history: "A long time ago in a galaxy far, far away...",
        mission: "To rule the galaxy",
        vision: "To bring order to the galaxy",
        values: "Power, control, and fear",
        description:
          "The Galactic Empire is the most powerful force in the galaxy",
      },
    };

    await updateCompany(updateCompanyArgs);

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
        history: "A long time ago in a galaxy far, far away...",
        mission: "To rule the galaxy",
        vision: "To bring order to the galaxy",
        values: "Power, control, and fear",
        description:
          "The Galactic Empire is the most powerful force in the galaxy",
      },
    });
  });

  test("should update the company with the new address", async () => {
    const updateCompanyArgs = {
      name: "The Empire",
      userId: "darthVader123",
      address: {
        streetAddress: "123 Imperial Way",
        streetAddress2: "",
        city: "Coruscant",
        state: "Coruscant",
        postalCode: "12345",
        country: "Galactic Empire",
      },
    };

    const company = await updateCompany(updateCompanyArgs);

    expect(company).toMatchObject({
      id: 1,
      name: "The Empire",
      userId: "darthVader123",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(mockPrisma.companyAddress.update).toHaveBeenCalled();
    expect(mockPrisma.companyAddress.update).toHaveBeenCalledWith({
      where: {
        companyId: 1,
      },
      data: {
        streetAddress: "123 Imperial Way",
        streetAddress2: "",
        city: "Coruscant",
        state: "Coruscant",
        postalCode: "12345",
        country: "Galactic Empire",
      },
    });
  });

  test("should update the company with the new preferences", async () => {
    const updateCompanyArgs = {
      name: "The Empire",
      userId: "darthVader123",
      preferences: {
        desireability: CompanyDesireability.high,
        notes: "The most powerful company in the galaxy",
      },
    };

    await updateCompany(updateCompanyArgs);

    expect(mockPrisma.companyPreference.update).toHaveBeenCalled();
    expect(mockPrisma.companyPreference.update).toHaveBeenCalledWith({
      where: {
        companyId: 1,
      },
      data: {
        desireability: CompanyDesireability.high,
        notes: "The most powerful company in the galaxy",
      },
    });
  });
});
