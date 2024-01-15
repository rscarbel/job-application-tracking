import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";
import {
  BoardStructureInterface,
  ColumnNameEnum,
} from "./BoardStructureInterface";
import { ApplicationStatus } from "@prisma/client";
import { columnOrder } from "./BoardStructureInterface";

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
  {
    id: ApplicationStatus.applied,
    title: ColumnNameEnum.Applied,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.interview,
    title: ColumnNameEnum.Interview,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.offer,
    title: ColumnNameEnum.Offer,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.rejected,
    title: ColumnNameEnum.Rejected,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.passed,
    title: ColumnNameEnum.Passed,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.accepted,
    title: ColumnNameEnum.Accepted,
    applicationIds: [],
  },
];
