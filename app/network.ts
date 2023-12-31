import { reportErrorToServer } from "@/utils/global";
import { ApplicationFrontEndType, NewApplicationFormData } from "./types";

export const updateCardStatus = async (applicationId, newStatus, index) => {
  const response = await fetch("/api/applicationGroup/updateStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: applicationId,
      status: newStatus,
      newPositionIndex: index,
    }),
  });

  const data = await response.json();
  return { response, data };
};

export const updateCard = async (card: ApplicationFrontEndType) => {
  const response = await fetch("/api/applicationGroup/updateCard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(card),
  });

  const data = await response.json();
  return { response, data };
};

export const deleteCard = async (applicationId: number) => {
  const response = await fetch("/api/applicationGroup/deleteCard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: applicationId }),
  });

  const data = await response.json();
  return { response, data };
};

export const createCard = async (card: NewApplicationFormData) => {
  try {
    const response = await fetch("/api/applicationGroup/createCard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    });
    const data = await response.json();
    return { response, data };
  } catch (error) {
    await reportErrorToServer(error);
  }
};

export const findCompanies = async () => {
  const response = await fetch("/api/applicationGroup/find/companies");
  let data;
  try {
    const text = await response.text();
    data = JSON.parse(text);
  } catch (error) {
    await reportErrorToServer(error);
  }
  return data?.body || [];
};

export const findJobTitle = async ({
  companyName,
  jobTitle,
  groupId,
}: {
  companyName: string;
  jobTitle: string;
  groupId: number;
}) => {
  const response = await fetch(
    `/api/applicationGroup/find/jobTitle?companyName=${companyName}&jobTitle=${jobTitle}&groupId=${groupId}`
  );
  let data;
  try {
    const text = await response.text();
    data = JSON.parse(text);
  } catch (error) {
    await reportErrorToServer(error);
  }
  return data?.body || null;
};

export const findCard = async (applicationId: number) => {
  const response = await fetch(
    `/api/applicationGroup/find/card?applicationId=${applicationId}`
  );
  let data;
  try {
    const text = await response.text();
    const responseData = JSON.parse(text);
    data = JSON.parse(responseData.body);
  } catch (error) {
    await reportErrorToServer(error);
  }
  return data;
};
