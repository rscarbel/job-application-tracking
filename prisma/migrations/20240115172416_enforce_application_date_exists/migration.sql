/*
  Warnings:

  - Made the column `applicationDate` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "applicationDate" SET NOT NULL,
ALTER COLUMN "applicationDate" SET DEFAULT CURRENT_TIMESTAMP;
