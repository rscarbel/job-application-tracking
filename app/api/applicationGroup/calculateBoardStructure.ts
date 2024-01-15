import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";
import {
  BoardStructureInterface,
  ColumnNameEnum,
} from "./BoardStructureInterface";
import { ApplicationStatus } from "@prisma/client";
import { columnOrder } from "./BoardStructureInterface";

interface ColumnInterface {
  id: ApplicationStatus;
  title: ColumnNameEnum;
  applicationIds: string[];
}

interface GeneratedColumnsInterface {
  [key: string]: ColumnInterface;
}

interface GeneratedApplicationsInterface {
  [key: string]: FormattedCardForBoardInterface;
}

export const calculateBoardStructure = (
  applications: FormattedCardForBoardInterface[]
): BoardStructureInterface => {
  const generatedColumns = columns.reduce<GeneratedColumnsInterface>(
    (acc, column) => {
      const columnApplications = applications.filter(
        (application) => application.status === column.id
      );
      acc[column.id] = {
        ...column,
        applicationIds: columnApplications.map((application) =>
          application.applicationId.toString()
        ),
      };
      return acc;
    },
    {}
  );

  return {
    applications: applications.reduce<GeneratedApplicationsInterface>(
      (acc, card) => {
        acc[card.applicationId.toString()] = card;
        return acc;
      },
      {}
    ),
    columns: generatedColumns,
    columnOrder: columnOrder,
  };
};

const columns: ColumnInterface[] = [
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
