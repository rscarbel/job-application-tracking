import { ApplicationStatus } from "@prisma/client";
import { ColumnNameEnum } from "@/app/api/applicationGroup/BoardStructureInterface";

export const mapColumnNameToApplicationStatus = (
  status: ColumnNameEnum
): ApplicationStatus => {
  switch (status) {
    case ColumnNameEnum.APPLIED:
      return ApplicationStatus.APPLIED;
    case ColumnNameEnum.INTERVIEW:
      return ApplicationStatus.INTERVIEW;
    case ColumnNameEnum.OFFER:
      return ApplicationStatus.OFFER;
    case ColumnNameEnum.REJECTED:
      return ApplicationStatus.REJECTED;
    case ColumnNameEnum.ACCEPTED:
      return ApplicationStatus.ACCEPTED;
    case ColumnNameEnum.PASSED:
      return ApplicationStatus.PASSED;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};
