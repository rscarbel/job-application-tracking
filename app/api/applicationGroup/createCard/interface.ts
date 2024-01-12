import {
  CompanyInterface,
  WorkModeEnum,
  PayFrequencyEnum,
  ApplicationStatusEnum,
} from "@/utils/databaseTypes";

export interface CreateCardRequest {
  status: ApplicationStatusEnum;
  groupId: number;
  jobTitle: string;
  company: CompanyInterface;
  payAmount: number;
  payFrequency: PayFrequencyEnum;
  jobDescription: string;
  currency: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  applicationLink: string;
  workMode: WorkModeEnum;
  applicationDate: string;
  positionIndex: number;
  notes: string;
}
