export const calculateBoardStructure = (applicationCards) => {
  const generatedColumns = columns.reduce((acc, column) => {
    const columnApplicationCards = applicationCards.filter(
      (applicationCard) => applicationCard.status === column.id
    );
    acc[column.id] = {
      ...column,
      applicationCardIds: columnApplicationCards.map(
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
  { id: "applied", title: "Applied", applicationCardIds: [] },
  { id: "interview", title: "Interview", applicationCardIds: [] },
  { id: "offer", title: "Offer", applicationCardIds: [] },
  { id: "rejected", title: "Rejected", applicationCardIds: [] },
  { id: "passed", title: "Passed", applicationCardIds: [] },
  { id: "accepted", title: "Accepted", applicationCardIds: [] },
];

const columnOrder = [
  "applied",
  "interview",
  "offer",
  "rejected",
  "accepted",
  "passed",
];
