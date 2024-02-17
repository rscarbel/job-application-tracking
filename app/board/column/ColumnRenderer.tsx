import { FunctionComponent } from "react";
import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";
import { BoardStructureInterface } from "@/app/api/applicationGroup/BoardStructureInterface";
import SingleColumn from "./SingleColumn";
import DoubleColumn from "./DoubleColumn";
import { ApplicationStatus } from "@prisma/client";

interface ColumnRendererProps {
  columnId: ApplicationStatus;
  columns: BoardStructureInterface["columns"];
  applications: { [key: string]: FormattedCardForBoardInterface };
}

const ColumnRenderer: FunctionComponent<ColumnRendererProps> = ({
  columnId,
  columns,
  applications,
}) => {
  const doubleColumns: { [key: string]: ApplicationStatus } = {
    OFFER: ApplicationStatus.ACCEPTED,
    REJECTED: ApplicationStatus.PASSED,
  };

  if (doubleColumns[columnId]) {
    const column = columns[columnId];
    const pairedColumn = columns[doubleColumns[columnId]];
    return (
      <DoubleColumn
        key={`${columnId}-${doubleColumns[columnId]}-group`}
        column1={column}
        column2={pairedColumn}
        applications1={column.applicationIds.map(
          (taskId: string) => applications[taskId]
        )}
        applications2={pairedColumn.applicationIds.map(
          (taskId: string) => applications[taskId]
        )}
      />
    );
  }

  if (!Object.values(doubleColumns).includes(columnId)) {
    const column = columns[columnId];
    return (
      <SingleColumn
        key={columnId}
        column={column}
        applications={column.applicationIds.map(
          (taskId: string) => applications[taskId]
        )}
      />
    );
  }

  return null;
};

export default ColumnRenderer;
