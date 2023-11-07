export const MAX_CHARACTERS = 10;

export const getStatusColor = (status) => {
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

export const payFrequencyOptions = [
  { label: "per hour", value: "hourly" },
  { label: "per week", value: "weekly" },
  { label: "biweekly", value: "biweekly" },
  { label: "per month", value: "monthly" },
  { label: "per year", value: "yearly" },
];

export const humanizedPayFrequency = {
  hourly: "per hour",
  weekly: "per week",
  biweekly: "biweekly",
  monthly: "per month",
  yearly: "per year",
};

export const prettifyPay = (pay) => {
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

export const truncateText = (text, maxLength = MAX_CHARACTERS) => {
  if (!text) return text;

  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const handleSameColumnMove = (
  startColumn,
  source,
  destination,
  draggableId
) => {
  const newTaskIds = Array.from(startColumn.applicationCardIds);
  newTaskIds.splice(source.index, 1);
  newTaskIds.splice(destination.index, 0, draggableId);
  return {
    [startColumn.id]: { ...startColumn, applicationCardIds: newTaskIds },
  };
};

export const handleDifferentColumnMove = (
  startColumn,
  endColumn,
  source,
  destination,
  draggableId
) => {
  const newStartTaskIds = Array.from(startColumn.applicationCardIds);
  newStartTaskIds.splice(source.index, 1);

  const newEndTaskIds = Array.from(endColumn.applicationCardIds);
  newEndTaskIds.splice(destination.index, 0, draggableId);

  return {
    [startColumn.id]: { ...startColumn, applicationCardIds: newStartTaskIds },
    [endColumn.id]: { ...endColumn, applicationCardIds: newEndTaskIds },
  };
};
