export interface UserReportInterface {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface ReportErrorObjectInterface {
  message: string;
  stack: string;
}
