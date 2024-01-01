-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('onsite', 'remote', 'hybrid');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('applied', 'interview', 'offer', 'rejected', 'accepted', 'passed');

-- CreateEnum
CREATE TYPE "PayFrequency" AS ENUM ('hourly', 'weekly', 'biweekly', 'monthly', 'yearly');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RESUME', 'COVER_LETTER', 'PORTFOLIO', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactInteractionType" AS ENUM ('EMAIL', 'CALL', 'MEETING', 'OTHER');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('TINY', 'SMALL', 'MEDIUM', 'LARGE', 'MASSIVE');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('GOVERNMENT_AGENCY', 'NON_PROFIT', 'PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "BenefitType" AS ENUM ('BONUSES_AND_INCENTIVES', 'CASUAL_DRESS_CODE', 'CHILDCARE_ASSISTANCE', 'COMMUTER_BENEFITS', 'COMPANY_CAR_OR_ALLOWANCE', 'COMPANY_DISCOUNTS', 'COMPANY_EVENTS_AND_RETREATS', 'CONFERENCE_ATTENDANCE', 'CULTURAL_LEAVE', 'CUSTOMIZABLE_BENEFITS_PACKAGE', 'DISABILITY_INSURANCE', 'ELDER_CARE_ASSISTANCE', 'EMERGENCY_CHILD_AND_ELDER_CARE', 'EMPLOYEE_ASSISTANCE_PROGRAMS', 'EMPLOYEE_RECOGNITION_PROGRAMS', 'EXTENDED_MATERNITY_AND_PATERNITY_LEAVE', 'FINANCIAL_PLANNING_SERVICES', 'FLEXIBLE_SCHEDULING', 'FLEXIBLE_SPENDING_ACCOUNTS', 'FREE_OR_SUBSIDIZED_MEALS', 'GLOBAL_WORK_OPPORTUNITIES', 'GREEN_COMMUTING_INCENTIVES', 'GYM_MEMBERSHIPS', 'HEALTH_INSURANCE', 'HEALTH_SAVINGS_ACCOUNTS', 'HEALTHCARE_SPECIALIST_ACCESS', 'HOME_OFFICE_STIPEND', 'HOUSING_ASSISTANCE', 'IDENTITY_THEFT_PROTECTION', 'LANGUAGE_LEARNING_ASSISTANCE', 'LEGAL_ASSISTANCE', 'LIFE_INSURANCE', 'MENTAL_HEALTH_ASSISTANCE', 'MENTORSHIP_PROGRAMS', 'MOVING_EXPENSE_REIMBURSEMENT', 'ONSITE_CHILDCARE_FACILITIES', 'PAID_PARENTAL_LEAVE', 'PAID_TIME_OFF', 'PARKING_BENEFITS', 'PET_FRIENDLY_WORKPLACE', 'PET_INSURANCE', 'PROFESSIONAL_MEMBERSHIPS', 'RELOCATION_ASSISTANCE', 'REMOTE_WORK_OPTIONS', 'RETIREMENT_PLANS', 'SABBATICAL_LEAVE', 'SOCIAL_IMPACT_PROJECTS', 'STOCK_OPTIONS', 'STRESS_MANAGEMENT_PROGRAMS', 'SUBSTANCE_ABUSE_ASSISTANCE', 'TECHNOLOGY_ALLOWANCE', 'TEMPORARY_HOUSING_ASSISTANCE', 'TRAINING_AND_DEVELOPMENT', 'TUITION_REIMBURSEMENT', 'VOLUNTEER_TIME_OFF', 'WELLNESS_PROGRAMS');

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "applicationDate" TIMESTAMP(3),
    "applicationLink" TEXT,
    "jobId" INTEGER NOT NULL,
    "positionIndex" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'applied',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationGroupId" INTEGER NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "ApplicationTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "responsibilities" TEXT[],
    "benefits" "BenefitType"[],
    "description" TEXT,
    "companyId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "workMode" "WorkMode" NOT NULL DEFAULT 'onsite',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compensation" (
    "id" SERIAL NOT NULL,
    "payAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payFrequency" "PayFrequency" NOT NULL DEFAULT 'hourly',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "salaryRangeMin" DOUBLE PRECISION,
    "salaryRangeMax" DOUBLE PRECISION,
    "hoursWeek" INTEGER NOT NULL DEFAULT 40,
    "negotiable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "Compensation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ApplicationGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyDetail" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "culture" TEXT,
    "desireability" INTEGER,
    "industry" TEXT,
    "size" "CompanySize",
    "website" TEXT,
    "type" "CompanyType",
    "history" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "values" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "companyId" INTEGER,
    "notes" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactAttribute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "ContactAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "streetAddress" TEXT,
    "streetAddress2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'United States',
    "postalCode" TEXT,
    "fromDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "throughDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobId" INTEGER,
    "userId" TEXT,
    "companyId" INTEGER,
    "contactId" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "scheduledTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuth" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "url" TEXT,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInteraction" (
    "id" SERIAL NOT NULL,
    "contactId" INTEGER NOT NULL,
    "type" "ContactInteractionType" NOT NULL,
    "notes" TEXT,
    "interactionTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationToDocument" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationToApplicationTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Application_applicationGroupId_idx" ON "Application"("applicationGroupId");

-- CreateIndex
CREATE INDEX "ApplicationTag_groupId_idx" ON "ApplicationTag"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationTag_name_groupId_key" ON "ApplicationTag"("name", "groupId");

-- CreateIndex
CREATE INDEX "Job_companyId_idx" ON "Job"("companyId");

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_title_companyId_userId_workMode_key" ON "Job"("title", "companyId", "userId", "workMode");

-- CreateIndex
CREATE UNIQUE INDEX "Compensation_jobId_key" ON "Compensation"("jobId");

-- CreateIndex
CREATE INDEX "Compensation_jobId_idx" ON "Compensation"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationGroup_name_userId_key" ON "ApplicationGroup"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Company_userId_idx" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_userId_key" ON "Company"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyDetail_companyId_key" ON "CompanyDetail"("companyId");

-- CreateIndex
CREATE INDEX "CompanyDetail_companyId_idx" ON "CompanyDetail"("companyId");

-- CreateIndex
CREATE INDEX "Contact_companyId_idx" ON "Contact"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_userId_firstName_lastName_email_companyId_key" ON "Contact"("userId", "firstName", "lastName", "email", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactAttribute_name_contactId_key" ON "ContactAttribute"("name", "contactId");

-- CreateIndex
CREATE INDEX "Address_jobId_idx" ON "Address"("jobId");

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "Address_companyId_idx" ON "Address"("companyId");

-- CreateIndex
CREATE INDEX "Address_contactId_idx" ON "Address"("contactId");

-- CreateIndex
CREATE INDEX "EmailTemplate_userId_idx" ON "EmailTemplate"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_userId_key" ON "EmailTemplate"("name", "userId");

-- CreateIndex
CREATE INDEX "Interview_applicationId_idx" ON "Interview"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "OAuth_provider_externalId_key" ON "OAuth"("provider", "externalId");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "ContactInteraction_contactId_idx" ON "ContactInteraction"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToDocument_AB_unique" ON "_ApplicationToDocument"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToDocument_B_index" ON "_ApplicationToDocument"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToApplicationTag_AB_unique" ON "_ApplicationToApplicationTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToApplicationTag_B_index" ON "_ApplicationToApplicationTag"("B");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicationGroupId_fkey" FOREIGN KEY ("applicationGroupId") REFERENCES "ApplicationGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationTag" ADD CONSTRAINT "ApplicationTag_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ApplicationGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compensation" ADD CONSTRAINT "Compensation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationGroup" ADD CONSTRAINT "ApplicationGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDetail" ADD CONSTRAINT "CompanyDetail_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAttribute" ADD CONSTRAINT "ContactAttribute_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuth" ADD CONSTRAINT "OAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInteraction" ADD CONSTRAINT "ContactInteraction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToDocument" ADD CONSTRAINT "_ApplicationToDocument_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToDocument" ADD CONSTRAINT "_ApplicationToDocument_B_fkey" FOREIGN KEY ("B") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToApplicationTag" ADD CONSTRAINT "_ApplicationToApplicationTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToApplicationTag" ADD CONSTRAINT "_ApplicationToApplicationTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ApplicationTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
