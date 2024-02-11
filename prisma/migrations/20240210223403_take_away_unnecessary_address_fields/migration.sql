/*
  Warnings:

  - You are about to drop the column `fromDate` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `throughDate` on the `CompanyAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyAddress" DROP COLUMN "fromDate",
DROP COLUMN "throughDate";
