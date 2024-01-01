import { ApplicationStatus, WorkMode, PayFrequency } from "@prisma/client";

type Company = {
  companyId?: number;
  name: string;
};

export type NewApplicationFormData = {
  jobId?: number;
  groupId: number;
  company: Company;
  jobTitle: string;
  jobDescription?: string;
  workMode?: WorkMode;
  payAmount?: number;
  payFrequency?: PayFrequency;
  currency?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  applicationLink?: string;
  applicationDate?: string;
  positionIndex?: number;
  notes?: string;
  status?: ApplicationStatus;
};

export type ApplicationFrontEndType = {
  applicationId: number;
  groupId: number;
  jobId: number;
  company: Company;
  jobTitle: string;
  jobDescription?: string;
  workMode: WorkMode;
  payAmount: number;
  payFrequency: PayFrequency;
  currency: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  applicationLink?: string;
  notes?: string;
  status: ApplicationStatus;
};

export type ApplicationType = {
  id: number;
  groupId: number;
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

export interface ApplicationInterface {
  applicationId: number;
  groupId: number;
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
