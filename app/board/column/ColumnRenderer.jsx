import SingleColumn from "./SingleColumn";
import DoubleColumn from "./DoubleColumn";

const ColumnRenderer = ({ columnId, columns, applicationCards }) => {
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
        applicationCards1={column.applicationIds.map(
          (taskId) => applicationCards[taskId]
        )}
        applicationCards2={pairedColumn.applicationIds.map(
          (taskId) => applicationCards[taskId]
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
        applicationCards={column.applicationIds.map(
          (taskId) => applicationCards[taskId]
        )}
      />
    );
  }

  return null;
};

export default ColumnRenderer;
