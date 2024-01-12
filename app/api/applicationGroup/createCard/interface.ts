import {
  CompanyInterface,
  WorkModeEnum,
  PayFrequencyEnum,
  ApplicationStatusEnum,
  CompanyDesireabilityEnum,
} from "@/utils/databaseTypes";

export interface CreateCardRequest {
  applicationDate: string;
  applicationLink: string;
  city: string;
  company: CompanyInterface;
  country: string;
  currency: string;
  desireability: CompanyDesireabilityEnum;
  groupId: number;
  jobDescription: string;
  jobTitle: string;
  notes: string;
  payAmount: number;
  payFrequency: PayFrequencyEnum;
  positionIndex: number;
  postalCode: string;
  state: string;
  status: ApplicationStatusEnum;
  streetAddress: string;
  streetAddress2: string;
  workMode: WorkModeEnum;
}
