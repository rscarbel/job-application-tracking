import { CompanyInterface } from "@/utils/databaseTypes";
import {
  WorkMode,
  ApplicationStatus,
  PayFrequency,
  CompanyDesireability,
} from "@prisma/client";

export interface CreateCardRequest {
  applicationDate: Date;
  applicationLink: string;
  city: string;
  company: CompanyInterface;
  country: string;
  currency: string;
  desireability: CompanyDesireability;
  groupId: number;
  jobDescription: string;
  jobTitle: string;
  notes: string;
  payAmount: number;
  payFrequency: PayFrequency;
  positionIndex: number;
  postalCode: string;
  state: string;
  status: ApplicationStatus;
  streetAddress: string;
  streetAddress2: string;
  workMode: WorkMode;
}
