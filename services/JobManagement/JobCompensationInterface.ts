import { PayFrequency } from "@prisma/client";

export interface JobCompensationInterface {
  payAmount?: number;
  payFrequency?: PayFrequency;
  currency?: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  hoursWeek?: number;
  negotiable?: boolean;
  jobId?: number;
}
