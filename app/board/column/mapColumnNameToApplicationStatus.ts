import { ApplicationStatusEnum } from "@/utils/databaseTypes";
import { ColumnNameEnum } from "@/app/api/applicationGroup/BoardStructureInterface";

export const mapColumnNameToApplicationStatus = (
  status: ColumnNameEnum
): ApplicationStatusEnum => {
  switch (status) {
    case ColumnNameEnum.Applied:
      return ApplicationStatusEnum.Applied;
    case ColumnNameEnum.Interview:
      return ApplicationStatusEnum.Interview;
    case ColumnNameEnum.Offer:
      return ApplicationStatusEnum.Offer;
    case ColumnNameEnum.Rejected:
      return ApplicationStatusEnum.Rejected;
    case ColumnNameEnum.Accepted:
      return ApplicationStatusEnum.Accepted;
    case ColumnNameEnum.Passed:
      return ApplicationStatusEnum.Passed;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};
