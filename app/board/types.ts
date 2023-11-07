import { ApplicationStatus, WorkMode, PayFrequency } from "@prisma/client";

export type ApplicationCardType = {
  id: number;
  boardId: number;
  jobId: number;
  applicationLink: string;
  applicationDate: Date;
  status: ApplicationStatus;
  positionIndex: number;
  notes?: string;
  job: {
    title: string;
    description: string;
    workMode: WorkMode;
    company: {
      id: number;
      name: string;
    };
    compensation: {
      payAmount: number;
      payFrequency: PayFrequency;
      currency: string;
    };
    address?: {
      streetAddress?: string;
      streetAddress2?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  };
};

export interface ApplicationCardInterface {
  cardId: number;
  boardId: number;
  companyName: string;
  title: string;
  payAmount: number;
  payFrequency: PayFrequency;
  currency: string;
  workMode: WorkMode;
  city: string;
  country: string;
  applicationLink?: string;
  applicationDate: string;
  status: ApplicationStatus;
  index: number;
}

export type JobType = {
  id: number;
  title: string;
  company: {
    name: string;
  };
  workMode: WorkMode;
  compensation: {
    payAmount: number;
    payFrequency: PayFrequency;
    currency: string;
  };
  address?: {
    city?: string;
    country?: string;
  };
};
