/*
  Warnings:

  - You are about to drop the column `jobId` on the `Benefit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,userId]` on the table `Benefit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Benefit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Benefit" DROP CONSTRAINT "Benefit_jobId_fkey";

-- AlterTable
ALTER TABLE "Benefit" DROP COLUMN "jobId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "JobBenefit" (
    "jobId" INTEGER NOT NULL,
    "benefitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobBenefit_pkey" PRIMARY KEY ("jobId","benefitId")
);

-- CreateIndex
CREATE INDEX "JobBenefit_benefitId_idx" ON "JobBenefit"("benefitId");

-- CreateIndex
CREATE UNIQUE INDEX "Benefit_name_userId_key" ON "Benefit"("name", "userId");

-- AddForeignKey
ALTER TABLE "JobBenefit" ADD CONSTRAINT "JobBenefit_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobBenefit" ADD CONSTRAINT "JobBenefit_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "Benefit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
