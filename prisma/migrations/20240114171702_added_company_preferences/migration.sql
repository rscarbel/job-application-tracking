/*
  Warnings:

  - You are about to drop the column `desireability` on the `CompanyDetail` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `CompanyDetail` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CompanyDesireability" AS ENUM ('high', 'medium', 'low');

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CompanyDetail" DROP COLUMN "desireability",
DROP COLUMN "notes";

-- CreateTable
CREATE TABLE "CompanyPreference" (
    "id" SERIAL NOT NULL,
    "desireability" "CompanyDesireability",
    "notes" TEXT,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyPreference_companyId_key" ON "CompanyPreference"("companyId");

-- CreateIndex
CREATE INDEX "CompanyPreference_companyId_idx" ON "CompanyPreference"("companyId");

-- AddForeignKey
ALTER TABLE "CompanyPreference" ADD CONSTRAINT "CompanyPreference_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
