/*
  Warnings:

  - You are about to drop the column `companyName` on the `Application` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name,website]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Made the column `website` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Company_name_website_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "companyName",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "website" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Application_companyId_idx" ON "Application"("companyId");

-- CreateIndex
CREATE INDEX "Company_userId_idx" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_name_website_key" ON "Company"("userId", "name", "website");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
