import { WorkMode, ApplicationStatus, PayFrequency } from "@prisma/client";

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
  workMode: WorkMode;
  payAmount: number;
  payFrequency: PayFrequency;
  currency: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  applicationLink: string;
  applicationDate: Date;
  status: ApplicationStatus;
  positionIndex: number;
  notes: string;
}

export interface FormattedCardForBoardInterface {
  applicationId: number;
  groupId: number;
  companyName: string;
  title: string;
  workMode: WorkMode;
  payAmount: number;
  payFrequency: PayFrequency;
  currency: string;
  city: string;
  country: string;
  applicationLink: string;
  applicationDate: string;
  status: ApplicationStatus;
}
