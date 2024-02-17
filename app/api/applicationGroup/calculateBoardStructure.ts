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
        (application) =>
          application.status.toLocaleLowerCase() ===
          column.id.toLocaleLowerCase()
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
    id: ApplicationStatus.APPLIED,
    title: ColumnNameEnum.APPLIED,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.INTERVIEW,
    title: ColumnNameEnum.INTERVIEW,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.OFFER,
    title: ColumnNameEnum.OFFER,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.REJECTED,
    title: ColumnNameEnum.REJECTED,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.PASSED,
    title: ColumnNameEnum.PASSED,
    applicationIds: [],
  },
  {
    id: ApplicationStatus.ACCEPTED,
    title: ColumnNameEnum.ACCEPTED,
    applicationIds: [],
  },
];
