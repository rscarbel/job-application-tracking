import { reportErrorToServer } from "@/utils/global";
import { ApplicationCardFrontEndType } from "./types";

export const updateCardStatus = async (cardId, newStatus, index) => {
  const response = await fetch("/api/applicationBoard/updateStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: cardId,
      status: newStatus,
      newPositionIndex: index,
    }),
  });

  const data = await response.json();
  return { response, data };
};

export const updateCard = async (card: ApplicationCardFrontEndType) => {
  const response = await fetch("/api/applicationBoard/updateCard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(card),
  });

  const data = await response.json();
  return { response, data };
};

export const deleteCard = async (cardId: number) => {
  const response = await fetch("/api/applicationBoard/deleteCard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: cardId }),
  });

  const data = await response.json();
  return { response, data };
};

export const createCard = async (card: ApplicationCardFrontEndType) => {
  try {
    const response = await fetch("/api/applicationBoard/createCard", {
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

export const findCompanies = async (userId: String) => {
  const response = await fetch(
    `/api/applicationBoard/find/companies?userId=${userId}`
  );
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
  userId,
  companyName,
  jobTitle,
  boardId,
}: {
  userId: string;
  companyName: string;
  jobTitle: string;
  boardId: number;
}) => {
  const response = await fetch(
    `/api/applicationBoard/find/jobTitle?userId=${userId}&companyName=${companyName}&jobTitle=${jobTitle}&boardId=${boardId}`
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

export const findCard = async (cardId: number) => {
  const response = await fetch(
    `/api/applicationBoard/find/card?cardId=${cardId}`
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
