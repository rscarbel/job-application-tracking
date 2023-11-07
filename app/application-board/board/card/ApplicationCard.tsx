import { FC } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useEditCard } from "./EditCardContext";
import { formatCurrency } from "@/utils/global";
import { findCard } from "../../network";
import { getStatusColor, humanizedPayFrequency } from "../utils";
import { ApplicationCardInterface } from "../types";

const ApplicationCard: FC<ApplicationCardInterface> = ({
  cardId,
  boardId,
  companyName,
  title: jobTitle,
  workMode,
  payAmount,
  payFrequency,
  currency,
  city,
  country,
  applicationLink,
  applicationDate,
  status,
  index,
}) => {
  const cardStyles = {
    base: "p-4 mb-4 bg-white claymorphic-shadow claymorphic-shadow-hover rounded-lg border border-gray-200 relative",
    status: `absolute top-2 right-3 rounded-full px-2 py-0.3 text-xs font-medium ${getStatusColor(
      status
    )}`,
  };

  const payAmountDisplay = formatCurrency(payAmount, country, currency);
  const payFrequencyDisplay = humanizedPayFrequency[payFrequency];
  const hasPay = payAmount > 0;
  const payDisplay = `${payAmountDisplay} ${payFrequencyDisplay} (${workMode})`;
  const jobValueDisplay = hasPay ? payDisplay : workMode;
  const jobTitleDisplay = city ? `${jobTitle} - ${city}` : jobTitle;

  const { onEditClick } = useEditCard();

  return (
    <Draggable draggableId={String(cardId)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cardStyles.base}
          onClick={async () => {
            const card = await findCard(cardId);
            onEditClick({
              ...card,
              boardId: 1,
            });
          }}
        >
          <div className={cardStyles.status}>{status}</div>
          <div className="mb-2 mt-1 text-lg font-bold text-gray-700">
            {jobTitleDisplay}
          </div>
          <div className="mb-1 text-md font-medium text-gray-600">
            {companyName}
          </div>
          <div className="mb-1 text-gray-600">{jobValueDisplay}</div>
          {applicationLink && (
            <a
              href={applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 text-blue-500 underline"
            >
              Application Link
            </a>
          )}
          <div className="mb-2 text-sm text-gray-500">
            Date Applied: {applicationDate}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ApplicationCard;
