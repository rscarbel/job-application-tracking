import SingleColumn from "./SingleColumn";
import DoubleColumn from "./DoubleColumn";

const ColumnRenderer = ({ columnId, columns, applications }) => {
  const doubleColumns = {
    offer: "accepted",
    rejected: "passed",
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
          (taskId) => applications[taskId]
        )}
        applications2={pairedColumn.applicationIds.map(
          (taskId) => applications[taskId]
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
          (taskId) => applications[taskId]
        )}
      />
    );
  }

  return null;
};

export default ColumnRenderer;
