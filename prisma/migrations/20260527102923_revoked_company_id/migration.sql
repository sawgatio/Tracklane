/*
  Warnings:

  - You are about to drop the column `companyId` on the `Application` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Application_companyId_idx";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "companyId";
