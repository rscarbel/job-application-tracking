import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";
import { ApplicationStatus } from "@prisma/client";

export const columnOrder = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.REJECTED,
  ApplicationStatus.ACCEPTED,
  ApplicationStatus.PASSED,
];

export enum ColumnNameEnum {
  APPLIED = "Applied",
  INTERVIEW = "Interview",
  OFFER = "Offer",
  REJECTED = "Rejected",
  ACCEPTED = "Accepted",
  PASSED = "Passed",
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
