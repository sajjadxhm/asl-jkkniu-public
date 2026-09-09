/*
  Warnings:

  - A unique constraint covering the columns `[personId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ResearcherPosition" AS ENUM ('RESEARCHER', 'LEAD_RESEARCHER', 'ASSOCIATE_RESEARCH_LEAD', 'PRINCIPAL_INVESTIGATOR');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'RESEARCHER';

-- AlterTable
ALTER TABLE "ResearcherProfile" ADD COLUMN     "academicSession" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "position" "ResearcherPosition" NOT NULL DEFAULT 'RESEARCHER',
ADD COLUMN     "researchInterests" TEXT,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "university" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "personId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_personId_key" ON "User"("personId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
