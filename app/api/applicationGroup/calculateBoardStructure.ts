import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";
import { BoardStructureInterface } from "./BoardStructureInterface";

export const calculateBoardStructure = (
  applications: FormattedCardForBoardInterface[]
): BoardStructureInterface => {
  const generatedColumns = columns.reduce((acc, column) => {
    const columnApplications = applications.filter(
      (application) => application.status === column.id
    );
    acc[column.id] = {
      ...column,
      applicationIds: columnApplications.map(
        (application) => application.applicationId
      ),
    };
    return acc;
  }, {});

  return {
    applications: applications.reduce((acc, card) => {
      acc[card.applicationId] = card;
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
