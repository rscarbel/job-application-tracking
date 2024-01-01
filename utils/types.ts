export enum WorkModeEnum {
    Onsite = 'onsite',
    Remote = 'remote',
    Hybrid = 'hybrid',
  }

export enum ApplicationStatusEnum {
  Applied = 'applied',
  Interview = 'interview',
  Offer = 'offer',
  Rejected = 'rejected',
  Accepted = 'accepted',
  Passed = 'passed',
}

export enum PayFrequencyEnum {
  Hourly = 'hourly',
  Weekly = 'weekly',
  Biweekly = 'biweekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum DocumentTypeEnum {
  Resume = 'RESUME',
  CoverLetter = 'COVER_LETTER',
  Portfolio = 'PORTFOLIO',
  Other = 'OTHER',
}

export enum ContactInteractionTypeEnum {
  Email = 'EMAIL',
  Call = 'CALL',
  Meeting = 'MEETING',
  Other = 'OTHER',
}

export enum CompanySizeEnum {
  Tiny = 'TINY',
  Small = 'SMALL',
  Medium = 'MEDIUM',
  Large = 'LARGE',
  Massive = 'MASSIVE',
}

export enum CompanyTypeEnum {
  GovernmentAgency = 'GOVERNMENT_AGENCY',
  NonProfit = 'NON_PROFIT',
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

export enum BenefitTypeEnum {
  BonusesAndIncentives = 'BONUSES_AND_INCENTIVES',
  CasualDressCode = 'CASUAL_DRESS_CODE',
  ChildcareAssistance = 'CHILDCARE_ASSISTANCE',
  CommuterBenefits = 'COMMUTER_BENEFITS',
  CompanyCarOrAllowance = 'COMPANY_CAR_OR_ALLOWANCE',
  CompanyDiscounts = 'COMPANY_DISCOUNTS',
  CompanyEventsAndRetreats = 'COMPANY_EVENTS_AND_RETREATS',
  ConferenceAttendance = 'CONFERENCE_ATTENDANCE',
  CulturalLeave = 'CULTURAL_LEAVE',
  CustomizableBenefitsPackage = 'CUSTOMIZABLE_BENEFITS_PACKAGE',
  DisabilityInsurance = 'DISABILITY_INSURANCE',
  ElderCareAssistance = 'ELDER_CARE_ASSISTANCE',
  EmergencyChildAndElderCare = 'EMERGENCY_CHILD_AND_ELDER_CARE',
  EmployeeAssistancePrograms = 'EMPLOYEE_ASSISTANCE_PROGRAMS',
  EmployeeRecognitionPrograms = 'EMPLOYEE_RECOGNITION_PROGRAMS',
  ExtendedMaternityAndPaternityLeave = 'EXTENDED_MATERNITY_AND_PATERNITY_LEAVE',
  FinancialPlanningServices = 'FINANCIAL_PLANNING_SERVICES',
  FlexibleScheduling = 'FLEXIBLE_SCHEDULING',
  FlexibleSpendingAccounts = 'FLEXIBLE_SPENDING_ACCOUNTS',
  FreeOrSubsidizedMeals = 'FREE_OR_SUBSIDIZED_MEALS',
  GlobalWorkOpportunities = 'GLOBAL_WORK_OPPORTUNITIES',
  GreenCommutingIncentives = 'GREEN_COMMUTING_INCENTIVES',
  GymMemberships = 'GYM_MEMBERSHIPS',
  HealthInsurance = 'HEALTH_INSURANCE',
  HealthSavingsAccounts = 'HEALTH_SAVINGS_ACCOUNTS',
  HealthcareSpecialistAccess = 'HEALTHCARE_SPECIALIST_ACCESS',
  HomeOfficeStipend = 'HOME_OFFICE_STIPEND',
  HousingAssistance = 'HOUSING_ASSISTANCE',
  IdentityTheftProtection = 'IDENTITY_THEFT_PROTECTION',
  LanguageLearningAssistance = 'LANGUAGE_LEARNING_ASSISTANCE',
  LegalAssistance = 'LEGAL_ASSISTANCE',
  LifeInsurance = 'LIFE_INSURANCE',
  MentalHealthAssistance = 'MENTAL_HEALTH_ASSISTANCE',
  MentorshipPrograms = 'MENTORSHIP_PROGRAMS',
  MovingExpenseReimbursement = 'MOVING_EXPENSE_REIMBURSEMENT',
  OnsiteChildcareFacilities = 'ONSITE_CHILDCARE_FACILITIES',
  PaidParentalLeave = 'PAID_PARENTAL_LEAVE',
  PaidTimeOff = 'PAID_TIME_OFF',
  ParkingBenefits = 'PARKING_BENEFITS',
  PetFriendlyWorkplace = 'PET_FRIENDLY_WORKPLACE',
  PetInsurance = 'PET_INSURANCE',
  ProfessionalMemberships = 'PROFESSIONAL_MEMBERSHIPS',
  RelocationAssistance = 'RELOCATION_ASSISTANCE',
  RemoteWorkOptions = 'REMOTE_WORK_OPTIONS',
  RetirementPlans = 'RETIREMENT_PLANS',
  SabbaticalLeave = 'SABBATICAL_LEAVE',
  SocialImpactProjects = 'SOCIAL_IMPACT_PROJECTS',
  StockOptions = 'STOCK_OPTIONS',
  StressManagementPrograms = 'STRESS_MANAGEMENT_PROGRAMS',
  SubstanceAbuseAssistance = 'SUBSTANCE_ABUSE_ASSISTANCE',
  TechnologyAllowance = 'TECHNOLOGY_ALLOWANCE',
  TemporaryHousingAssistance = 'TEMPORARY_HOUSING_ASSISTANCE',
  TrainingAndDevelopment = 'TRAINING_AND_DEVELOPMENT',
  TuitionReimbursement = 'TUITION_REIMBURSEMENT',
  VolunteerTimeOff = 'VOLUNTEER_TIME_OFF',
  WellnessPrograms = 'WELLNESS_PROGRAMS',
}

export interface ApplicationCardInterface {
  id: number;
  applicationDate?: Date | null;
  applicationLink?: string | null;
  jobId: number;
  positionIndex: number;
  notes?: string | null;
  status: ApplicationStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  applicationBoardId: number;
  documents: DocumentInterface[];
  interviews: InterviewInterface[];
  tags: ApplicationTagInterface[];
}

export interface ApplicationTagInterface {
  id: number;
  name: string;
  boardId: number;
  applications: ApplicationCardInterface[];
}

export interface JobInterface {
  id: number;
  title: string;
  responsibilities: string[];
  benefits: BenefitTypeEnum[];
  description?: string | null;
  companyId: number;
  userId: string;
  workMode?: WorkModeEnum | null;
  compensation?: CompensationInterface | null;
  addresses: AddressInterface[];
  createdAt: Date;
  updatedAt: Date;
  applications: ApplicationCardInterface[];
}

export interface CompensationInterface {
  id: number;
  payAmount: number;
  payFrequency: PayFrequencyEnum;
  currency: string;
  salaryRangeMin?: number | null;
  salaryRangeMax?: number | null;
  hoursWeek: number;
  negotiable: boolean;
  createdAt: Date;
  updatedAt: Date;
  jobId: number;
}

export interface ApplicationBoardInterface {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  applicationCards: ApplicationCardInterface[];
  tags: ApplicationTagInterface[];
}

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageURL?: string | null;
  oAuth: OAuthInterface[];
  applications: ApplicationBoardInterface[];
  companies: CompanyInterface[];
  emailTemplates: EmailTemplateInterface[];
  contacts: ContactInterface[];
  jobs: JobInterface[];
  createdAt: Date;
  updatedAt: Date;
  addresses: AddressInterface[];
  documents: DocumentInterface[];
}

export interface CompanyInterface {
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  addresses: AddressInterface[];
  details: CompanyDetailInterface | null;
  jobs: JobInterface[];
  contacts: ContactInterface[];
}

export interface CompanyDetailInterface {
  id: number;
  companyId: number;
  culture?: string | null;
  desireability?: number | null;
  industry?: string | null;
  size?: CompanySizeEnum | null;
  website?: string | null;
  type?: CompanyTypeEnum | null;
  history?: string | null;
  mission?: string | null;
  vision?: string | null;
  values?: string | null;
  description?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInterface {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;
  companyId?: number | null;
  notes?: string | null;
  attributes: ContactAttributeInterface[];
  interactions: ContactInteractionInterface[];
  addresses: AddressInterface[];
  userId: string;
}

export interface ContactAttributeInterface {
  id: number;
  name: string;
  value: string;
  contactId: number;
}

export interface AddressInterface {
  id: number;
  streetAddress?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  fromDate: Date;
  throughDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  jobId?: number | null;
  userId?: string | null;
  companyId?: number | null;
  contactId?: number | null;
}

export interface EmailTemplateInterface {
  id: number;
  name: string;
  subject: string;
  body: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewInterface {
  id: number;
  applicationCard: ApplicationCardInterface;
  applicationCardId: number;
  scheduledTime: Date;
  location?: string | null;
  notes?: string | null;
  feedback?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OAuthInterface {
  id: number;
  provider: string;
  externalId: string;
  user: User;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentInterface {
  id: number;
  user: User;
  userId: string;
  applicationCards: ApplicationCardInterface[];
  type: DocumentTypeEnum;
  url?: string | null;
  name: string;
  content?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInteractionInterface {
  id: number;
  contact: ContactInterface;
  contactId: number;
  type: ContactInteractionTypeEnum;
  notes?: string | null;
  interactionTime: Date;
  createdAt: Date;
  updatedAt: Date;
}