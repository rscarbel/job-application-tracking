import { Tooltip } from "primereact/tooltip";

interface SameJobMessageProps {
  previousApplicationDateOnThisBoard?: string;
  companyName?: string;
  previousBoardName?: string;
  jobTitle?: string;
  previousBoardDate?: string;
}

const SameJobMessage = ({
  previousApplicationDateOnThisBoard,
  companyName,
  previousBoardName,
  jobTitle,
  previousBoardDate,
}: SameJobMessageProps) => {
  if (previousApplicationDateOnThisBoard) {
    return (
      <div className="ml-2">
        <span
          className="pi pi-exclamation-triangle mt-2 text-lg cursor-pointer "
          style={{ color: "#ff9800" }}
          data-pr-tooltip={`An application already exists with this job title at ${companyName}. You applied on ${previousApplicationDateOnThisBoard}.`}
        ></span>
        <Tooltip
          target=".pi.pi-exclamation-triangle"
          // @ts-ignore - Typescript rejects the tooltipOptions prop for some reason
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  } else if (previousBoardName) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200 shadow-sm">
        <div className="flex items-center">
          <span
            className="pi pi-info-circle text-lg cursor-pointer mr-2 text-blue-600"
            data-pr-tooltip={`You applied for ${jobTitle} at ${companyName} on ${previousBoardDate} on the board, ${previousBoardName}.`}
          ></span>
          <p className="text-blue-700">Information</p>
        </div>
        <Tooltip
          target=".pi.pi-info-circle"
          // @ts-ignore - Typescript rejects the tooltipOptions prop for some reason
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  }

  return null;
};

export default SameJobMessage;
