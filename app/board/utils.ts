import { ApplicationStatus } from "@prisma/client";
export const MAX_CHARACTERS = 10;
import { ColumnNameEnum } from "../api/applicationGroup/BoardStructureInterface";

export const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case "APPLIED":
      return "bg-blue-100";
    case "INTERVIEW":
      return "bg-green-100";
    case "OFFER":
      return "bg-blue-300";
    case "REJECTED":
      return "bg-red-300";
    case "PASSED":
      return "bg-gray-300";
    case "ACCEPTED":
      return "bg-green-300";
    default:
      return "bg-gray-100";
  }
};

type PayFrequency = "HOURLY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "ANNUALLY";

export const payFrequencyOptions: { label: string; value: PayFrequency }[] = [
  { label: "per hour", value: "HOURLY" },
  { label: "per week", value: "WEEKLY" },
  { label: "biweekly", value: "BIWEEKLY" },
  { label: "per month", value: "MONTHLY" },
  { label: "per year", value: "ANNUALLY" },
];

export const humanizedPayFrequency: { [K in PayFrequency]: string } = {
  HOURLY: "per hour",
  WEEKLY: "per week",
  BIWEEKLY: "biweekly",
  MONTHLY: "per month",
  ANNUALLY: "per year",
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

interface ColumnInterface {
  id: ApplicationStatus;
  title: ColumnNameEnum;
  applicationIds: string[];
}

interface MoveResult {
  [key: string]: ColumnInterface;
}

export const handleSameColumnMove = (
  startColumn: ColumnInterface,
  source: { index: number },
  destination: { index: number },
  draggableId: string
): MoveResult => {
  const newApplicationIds = Array.from(startColumn.applicationIds);
  newApplicationIds.splice(source.index, 1);
  newApplicationIds.splice(destination.index, 0, draggableId);

  const updatedStartColumn: ColumnInterface = {
    ...startColumn,
    applicationIds: newApplicationIds,
  };

  return {
    [startColumn.id]: updatedStartColumn,
  };
};

export const handleDifferentColumnMove = (
  startColumn: ColumnInterface,
  endColumn: ColumnInterface,
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
