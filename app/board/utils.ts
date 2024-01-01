import { ApplicationStatus } from "@prisma/client";
export const MAX_CHARACTERS = 10;

export const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case "applied":
      return "bg-blue-100";
    case "interview":
      return "bg-green-100";
    case "offer":
      return "bg-blue-300";
    case "rejected":
      return "bg-red-300";
    case "passed":
      return "bg-gray-300";
    case "accepted":
      return "bg-green-300";
    default:
      return "bg-gray-100";
  }
};

type PayFrequency = "hourly" | "weekly" | "biweekly" | "monthly" | "yearly";

export const payFrequencyOptions: { label: string; value: PayFrequency }[] = [
  { label: "per hour", value: "hourly" },
  { label: "per week", value: "weekly" },
  { label: "biweekly", value: "biweekly" },
  { label: "per month", value: "monthly" },
  { label: "per year", value: "yearly" },
];

export const humanizedPayFrequency: { [K in PayFrequency]: string } = {
  hourly: "per hour",
  weekly: "per week",
  biweekly: "biweekly",
  monthly: "per month",
  yearly: "per year",
};

export const prettifyPay = (pay: number | string): string => {
  let payInteger = typeof pay === "number" ? pay : parseInt(pay);

  const prettifiedPay = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(payInteger);

  if (prettifiedPay.slice(-3) === ".00") {
    return prettifiedPay.slice(0, -3);
  }

  return prettifiedPay;
};

export const truncateText = (
  text: string,
  maxLength: number = MAX_CHARACTERS
): string => {
  if (!text) return text;

  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

interface Column {
  id: string;
  applicationIds: string[];
}

interface MoveResult {
  [key: string]: Column;
}

export const handleSameColumnMove = (
  startColumn: Column,
  source: { index: number },
  destination: { index: number },
  draggableId: string
): MoveResult => {
  const newTaskIds = Array.from(startColumn.applicationIds);
  newTaskIds.splice(source.index, 1);
  newTaskIds.splice(destination.index, 0, draggableId);
  return {
    [startColumn.id]: { ...startColumn, applicationIds: newTaskIds },
  };
};

export const handleDifferentColumnMove = (
  startColumn: Column,
  endColumn: Column,
  source: { index: number },
  destination: { index: number },
  draggableId: string
): MoveResult => {
  const newStartTaskIds = Array.from(startColumn.applicationIds);
  newStartTaskIds.splice(source.index, 1);

  const newEndTaskIds = Array.from(endColumn.applicationIds);
  newEndTaskIds.splice(destination.index, 0, draggableId);

  return {
    [startColumn.id]: { ...startColumn, applicationIds: newStartTaskIds },
    [endColumn.id]: { ...endColumn, applicationIds: newEndTaskIds },
  };
};
