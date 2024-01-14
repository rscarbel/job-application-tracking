import { PrismaClient } from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";

export type TransactionClient = Omit<
  PrismaClient<PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export enum CompanyDesireabilityEnum {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum WorkModeEnum {
  Onsite = "onsite",
  Remote = "remote",
  Hybrid = "hybrid",
}

export enum ApplicationStatusEnum {
  Applied = "applied",
  Interview = "interview",
  Offer = "offer",
  Rejected = "rejected",
  Accepted = "accepted",
  Passed = "passed",
}

export enum PayFrequencyEnum {
  Hourly = "hourly",
  Weekly = "weekly",
  Biweekly = "biweekly",
  Monthly = "monthly",
  Yearly = "yearly",
}

export enum DocumentTypeEnum {
  Resume = "RESUME",
  CoverLetter = "COVER_LETTER",
  Portfolio = "PORTFOLIO",
  Other = "OTHER",
}

export enum ContactInteractionTypeEnum {
  Email = "EMAIL",
  Call = "CALL",
  Meeting = "MEETING",
  Other = "OTHER",
}

export enum CompanySizeEnum {
  Tiny = "TINY",
  Small = "SMALL",
  Medium = "MEDIUM",
  Large = "LARGE",
  Massive = "MASSIVE",
}

export enum CompanyTypeEnum {
  GovernmentAgency = "GOVERNMENT_AGENCY",
  NonProfit = "NON_PROFIT",
  Private = "PRIVATE",
  Public = "PUBLIC",
}

export enum BenefitTypeEnum {
  BonusesAndIncentives = "BONUSES_AND_INCENTIVES",
  CasualDressCode = "CASUAL_DRESS_CODE",
  ChildcareAssistance = "CHILDCARE_ASSISTANCE",
  CommuterBenefits = "COMMUTER_BENEFITS",
  CompanyCarOrAllowance = "COMPANY_CAR_OR_ALLOWANCE",
  CompanyDiscounts = "COMPANY_DISCOUNTS",
  CompanyEventsAndRetreats = "COMPANY_EVENTS_AND_RETREATS",
  ConferenceAttendance = "CONFERENCE_ATTENDANCE",
  CulturalLeave = "CULTURAL_LEAVE",
  CustomizableBenefitsPackage = "CUSTOMIZABLE_BENEFITS_PACKAGE",
  DisabilityInsurance = "DISABILITY_INSURANCE",
  ElderCareAssistance = "ELDER_CARE_ASSISTANCE",
  EmergencyChildAndElderCare = "EMERGENCY_CHILD_AND_ELDER_CARE",
  EmployeeAssistancePrograms = "EMPLOYEE_ASSISTANCE_PROGRAMS",
  EmployeeRecognitionPrograms = "EMPLOYEE_RECOGNITION_PROGRAMS",
  ExtendedMaternityAndPaternityLeave = "EXTENDED_MATERNITY_AND_PATERNITY_LEAVE",
  FinancialPlanningServices = "FINANCIAL_PLANNING_SERVICES",
  FlexibleScheduling = "FLEXIBLE_SCHEDULING",
  FlexibleSpendingAccounts = "FLEXIBLE_SPENDING_ACCOUNTS",
  FreeOrSubsidizedMeals = "FREE_OR_SUBSIDIZED_MEALS",
  GlobalWorkOpportunities = "GLOBAL_WORK_OPPORTUNITIES",
  GreenCommutingIncentives = "GREEN_COMMUTING_INCENTIVES",
  GymMemberships = "GYM_MEMBERSHIPS",
  HealthInsurance = "HEALTH_INSURANCE",
  HealthSavingsAccounts = "HEALTH_SAVINGS_ACCOUNTS",
  HealthcareSpecialistAccess = "HEALTHCARE_SPECIALIST_ACCESS",
  HomeOfficeStipend = "HOME_OFFICE_STIPEND",
  HousingAssistance = "HOUSING_ASSISTANCE",
  IdentityTheftProtection = "IDENTITY_THEFT_PROTECTION",
  LanguageLearningAssistance = "LANGUAGE_LEARNING_ASSISTANCE",
  LegalAssistance = "LEGAL_ASSISTANCE",
  LifeInsurance = "LIFE_INSURANCE",
  MentalHealthAssistance = "MENTAL_HEALTH_ASSISTANCE",
  MentorshipPrograms = "MENTORSHIP_PROGRAMS",
  MovingExpenseReimbursement = "MOVING_EXPENSE_REIMBURSEMENT",
  OnsiteChildcareFacilities = "ONSITE_CHILDCARE_FACILITIES",
  PaidParentalLeave = "PAID_PARENTAL_LEAVE",
  PaidTimeOff = "PAID_TIME_OFF",
  ParkingBenefits = "PARKING_BENEFITS",
  PetFriendlyWorkplace = "PET_FRIENDLY_WORKPLACE",
  PetInsurance = "PET_INSURANCE",
  ProfessionalMemberships = "PROFESSIONAL_MEMBERSHIPS",
  RelocationAssistance = "RELOCATION_ASSISTANCE",
  RemoteWorkOptions = "REMOTE_WORK_OPTIONS",
  RetirementPlans = "RETIREMENT_PLANS",
  SabbaticalLeave = "SABBATICAL_LEAVE",
  SocialImpactProjects = "SOCIAL_IMPACT_PROJECTS",
  StockOptions = "STOCK_OPTIONS",
  StressManagementPrograms = "STRESS_MANAGEMENT_PROGRAMS",
  SubstanceAbuseAssistance = "SUBSTANCE_ABUSE_ASSISTANCE",
  TechnologyAllowance = "TECHNOLOGY_ALLOWANCE",
  TemporaryHousingAssistance = "TEMPORARY_HOUSING_ASSISTANCE",
  TrainingAndDevelopment = "TRAINING_AND_DEVELOPMENT",
  TuitionReimbursement = "TUITION_REIMBURSEMENT",
  VolunteerTimeOff = "VOLUNTEER_TIME_OFF",
  WellnessPrograms = "WELLNESS_PROGRAMS",
}

export interface ApplicationInterface {
  id?: number;
  applicationDate?: Date;
  applicationLink?: string;
  jobId: number;
  positionIndex: number;
  notes?: string;
  status: ApplicationStatusEnum;
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
  benefits?: BenefitTypeEnum[];
  description?: string;
  companyId: number;
  userId: string;
  workMode: WorkModeEnum;
  compensation: CompensationInterface;
  address?: AddressInterface;
  applications?: ApplicationInterface[];
}

export interface CompensationInterface {
  id?: number;
  payAmount: number;
  payFrequency: PayFrequencyEnum;
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
  size?: CompanySizeEnum;
  website?: string;
  type?: CompanyTypeEnum;
  history?: string;
  mission?: string;
  vision?: string;
  values?: string;
  description?: string;
}

export interface CompanyPreferenceInterface {
  id?: number;
  companyId?: number;
  desireability?: CompanyDesireabilityEnum;
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
  type: DocumentTypeEnum;
  url?: string;
  name: string;
  content?: string;
}

export interface ContactInteractionInterface {
  id?: number;
  contact: ContactInterface;
  contactId: number;
  type: ContactInteractionTypeEnum;
  notes?: string;
  interactionTime: Date;
}
