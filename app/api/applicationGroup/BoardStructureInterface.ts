import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";
import { ApplicationStatus } from "@prisma/client";

export const columnOrder = [
  ApplicationStatus.applied,
  ApplicationStatus.interview,
  ApplicationStatus.offer,
  ApplicationStatus.rejected,
  ApplicationStatus.accepted,
  ApplicationStatus.passed,
];

export enum ColumnNameEnum {
  Applied = "Applied",
  Interview = "Interview",
  Offer = "Offer",
  Rejected = "Rejected",
  Accepted = "Accepted",
  Passed = "Passed",
}

export interface BoardStructureInterface {
  applications: { [key: string]: FormattedCardForBoardInterface };
  columns: {
    [key: string]: {
      id: ApplicationStatus;
      title: ColumnNameEnum;
      applicationIds: string[];
    };
  };
  columnOrder: ApplicationStatus[];
}
