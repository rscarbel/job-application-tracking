export const calculateBoardStructure = (applicationCards) => {
  const generatedColumns = columns.reduce((acc, column) => {
    const columnApplicationCards = applicationCards.filter(
      (applicationCard) => applicationCard.status === column.id
    );
    acc[column.id] = {
      ...column,
      applicationIds: columnApplicationCards.map(
        (applicationCard) => applicationCard.cardId
      ),
    };
    return acc;
  }, {});

  return {
    applicationCards: applicationCards.reduce((acc, card) => {
      acc[card.cardId] = card;
      return acc;
    }, {}),
    columns: generatedColumns,
    columnOrder: columnOrder,
  };
};

const columns = [
  { id: "applied", title: "Applied", applicationIds: [] },
  { id: "interview", title: "Interview", applicationIds: [] },
  { id: "offer", title: "Offer", applicationIds: [] },
  { id: "rejected", title: "Rejected", applicationIds: [] },
  { id: "passed", title: "Passed", applicationIds: [] },
  { id: "accepted", title: "Accepted", applicationIds: [] },
];

const columnOrder = [
  "applied",
  "interview",
  "offer",
  "rejected",
  "accepted",
  "passed",
];
