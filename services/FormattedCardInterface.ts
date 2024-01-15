import {
  PayFrequencyEnum,
  ApplicationStatusEnum,
  WorkModeEnum,
} from "@/utils/databaseTypes";

export interface IndividualFormattedCardInterface {
  applicationId: number;
  groupId: number;
  jobId: number;
  company: {
    companyId: number;
    name: string;
  };
  jobTitle: string;
  jobDescription: string;
  workMode: WorkModeEnum;
  payAmount: number;
  payFrequency: PayFrequencyEnum;
  currency: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  applicationLink: string;
  applicationDate: Date;
  status: ApplicationStatusEnum;
  positionIndex: number;
  notes: string;
}

export interface FormattedCardForBoardInterface {
  applicationId: number;
  groupId: number;
  companyName: string;
  title: string;
  workMode: WorkModeEnum;
  payAmount: number;
  payFrequency: PayFrequencyEnum;
  currency: string;
  city: string;
  country: string;
  applicationLink: string;
  applicationDate: string;
  status: ApplicationStatusEnum;
}
