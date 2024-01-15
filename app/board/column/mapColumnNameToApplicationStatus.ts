import { ApplicationStatus } from "@prisma/client";
import { ColumnNameEnum } from "@/app/api/applicationGroup/BoardStructureInterface";

export const mapColumnNameToApplicationStatus = (
  status: ColumnNameEnum
): ApplicationStatus => {
  switch (status) {
    case ColumnNameEnum.Applied:
      return ApplicationStatus.applied;
    case ColumnNameEnum.Interview:
      return ApplicationStatus.interview;
    case ColumnNameEnum.Offer:
      return ApplicationStatus.offer;
    case ColumnNameEnum.Rejected:
      return ApplicationStatus.rejected;
    case ColumnNameEnum.Accepted:
      return ApplicationStatus.accepted;
    case ColumnNameEnum.Passed:
      return ApplicationStatus.passed;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};
