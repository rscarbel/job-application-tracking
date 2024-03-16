import {
  PrismaClient,
  ApplicationStatus,
  WorkMode,
  PayFrequency,
  CompanyDesireability,
  DocumentType,
  ContactInteractionType,
  CompanySize,
  CompanyType,
} from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";

export type TransactionClient = Omit<
  PrismaClient<never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export interface ApplicationInterface {
  id?: number;
  applicationDate?: Date;
  applicationLink?: string;
  jobId: number;
  positionIndex: number;
  notes?: string;
  status: ApplicationStatus;
  applicationGroupId: number;
  documents: DocumentInterface[];
  interviews: InterviewInterface[];
  tags: ApplicationTagInterface[];
}

export interface ApplicationTagInterface {
  id?: number;
  name: string;
  groupId: number;
  applications: ApplicationInterface[];
}

export interface JobInterface {
  id?: number;
  title: string;
  responsibilities?: string[];
  description?: string;
  companyId: number;
  userId: string;
  workMode: WorkMode;
  compensation: CompensationInterface;
  address?: AddressInterface;
  applications?: ApplicationInterface[];
}

export interface CompensationInterface {
  id?: number;
  payAmount: number;
  payFrequency: PayFrequency;
  currency: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  hoursWeek?: number;
  negotiable?: boolean;
  jobId?: number;
}

export interface ApplicationBoardInterface {
  id?: number;
  name: string;
  userId: string;
  applications: ApplicationInterface[];
  tags: ApplicationTagInterface[];
}

export interface UserInterface {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageURL?: string;
  oAuth?: OAuthInterface[];
  applications?: ApplicationBoardInterface[];
  companies?: CompanyInterface[];
  emailTemplates?: EmailTemplateInterface[];
  contacts?: ContactInterface[];
  jobs?: JobInterface[];
  addresses?: AddressInterface[];
  documents?: DocumentInterface[];
}

export interface CompanyInterface {
  id?: number;
  name: string;
  userId: string;
  addresses: AddressInterface[];
  details: CompanyDetailInterface;
  jobs: JobInterface[];
  contacts: ContactInterface[];
}

export interface CompanyDetailInterface {
  id?: number;
  companyId?: number;
  culture?: string;
  industry?: string;
  size?: CompanySize;
  website?: string;
  type?: CompanyType;
  history?: string;
  mission?: string;
  vision?: string;
  values?: string;
  description?: string;
}

export interface CompanyPreferenceInterface {
  id?: number;
  companyId?: number;
  desireability?: CompanyDesireability;
  notes?: string;
}

export interface ContactInterface {
  id?: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  companyId?: number;
  notes?: string;
  attributes: ContactAttributeInterface[];
  interactions: ContactInteractionInterface[];
  addresses: AddressInterface[];
  userId: string;
}

export interface ContactAttributeInterface {
  id?: number;
  name: string;
  value: string;
  contactId: number;
}

export interface AddressInterface {
  id?: number;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  fromDate?: Date;
  throughDate?: Date;
  jobId?: number;
  userId?: string;
  companyId?: number;
  contactId?: number;
}

export interface EmailTemplateInterface {
  id?: number;
  name: string;
  subject: string;
  body: string;
  userId: string;
}

export interface InterviewInterface {
  id?: number;
  application: ApplicationInterface;
  applicationId: number;
  scheduledTime: Date;
  location?: string;
  notes?: string;
  feedback?: string;
}

export interface OAuthInterface {
  id?: number;
  provider: string;
  externalId: string;
  user: UserInterface;
  userId: string;
}

export interface DocumentInterface {
  id?: number;
  user: UserInterface;
  userId: string;
  applications: ApplicationInterface[];
  type: DocumentType;
  url?: string;
  name: string;
  content?: string;
}

export interface ContactInteractionInterface {
  id?: number;
  contact: ContactInterface;
  contactId: number;
  type: ContactInteractionType;
  notes?: string;
  interactionTime: Date;
}
