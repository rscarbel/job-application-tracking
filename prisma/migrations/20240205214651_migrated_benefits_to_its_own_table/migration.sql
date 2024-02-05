/*
  Warnings:

  - You are about to drop the column `benefits` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Compensation" ALTER COLUMN "payAmount" DROP NOT NULL,
ALTER COLUMN "negotiable" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "benefits";

-- DropEnum
DROP TYPE "BenefitType";

-- CreateTable
CREATE TABLE "Benefit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Benefit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
