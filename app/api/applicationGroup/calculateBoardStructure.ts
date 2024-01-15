import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";
import {
  BoardStructureInterface,
  ColumnNameEnum,
} from "./BoardStructureInterface";
import { ApplicationStatusEnum } from "@/utils/databaseTypes";
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
    id: ApplicationStatusEnum.Applied,
    title: ColumnNameEnum.Applied,
    applicationIds: [],
  },
  {
    id: ApplicationStatusEnum.Interview,
    title: ColumnNameEnum.Interview,
    applicationIds: [],
  },
  {
    id: ApplicationStatusEnum.Offer,
    title: ColumnNameEnum.Offer,
    applicationIds: [],
  },
  {
    id: ApplicationStatusEnum.Rejected,
    title: ColumnNameEnum.Rejected,
    applicationIds: [],
  },
  {
    id: ApplicationStatusEnum.Passed,
    title: ColumnNameEnum.Passed,
    applicationIds: [],
  },
  {
    id: ApplicationStatusEnum.Accepted,
    title: ColumnNameEnum.Accepted,
    applicationIds: [],
  },
];
