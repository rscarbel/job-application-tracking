import { reportErrorToServer } from "@/utils/global";
import { ApplicationFrontEndType, NewApplicationFormData } from "./types";
import { ApplicationStatus } from "@prisma/client";

export const updateCardStatus = async (
  applicationId: number,
  newStatus: ApplicationStatus,
  index: number
) => {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      await reportErrorToServer(error);
    }
  }
};

interface CompanyInterface {
  companyId: number;
  name: string;
}

export const findCompanies = async (): Promise<CompanyInterface[]> => {
  try {
    const response = await fetch("/api/applicationGroup/find/companies");
    const text = await response.text();
    const parsedText = JSON.parse(text);
    return parsedText.body;
  } catch (error: unknown) {
    if (error instanceof Error) {
      await reportErrorToServer(error);
    }
    return [];
  }
};

interface JobTitleResponse {
  jobTitle: string;
  lastApplicationToJobInThisBoard: string;
  lastApplicationToJobInOtherBoard: {
    date: string;
    boardName: string;
  };
}

interface JobTitleRepsonseData {
  body?: JobTitleResponse;
}

export const findJobTitle = async ({
  companyName,
  jobTitle,
  groupId,
}: {
  companyName: string;
  jobTitle: string;
  groupId: number;
}): Promise<JobTitleResponse | null> => {
  const response = await fetch(
    `/api/applicationGroup/find/jobTitle?companyName=${companyName}&jobTitle=${jobTitle}&groupId=${groupId}`
  );
  let data: JobTitleRepsonseData | null = null;
  try {
    const text = await response.text();
    data = JSON.parse(text);
  } catch (error: unknown) {
    if (error instanceof Error) {
      await reportErrorToServer(error);
    }
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      await reportErrorToServer(error);
    }
  }
  return data;
};
