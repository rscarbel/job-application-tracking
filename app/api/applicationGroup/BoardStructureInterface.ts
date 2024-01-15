import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";
import { ApplicationStatusEnum } from "@/utils/databaseTypes";

export const columnOrder = [
  ApplicationStatusEnum.Applied,
  ApplicationStatusEnum.Interview,
  ApplicationStatusEnum.Offer,
  ApplicationStatusEnum.Rejected,
  ApplicationStatusEnum.Accepted,
  ApplicationStatusEnum.Passed,
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
      id: ApplicationStatusEnum;
      title: ColumnNameEnum;
      applicationIds: string[];
    };
  };
  columnOrder: ApplicationStatusEnum[];
}
