/*
  Warnings:

  - You are about to drop the column `clientProfileId` on the `NutritionistProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NutritionistProfile" DROP CONSTRAINT "NutritionistProfile_clientProfileId_fkey";

-- AlterTable
ALTER TABLE "ClientProfile" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "subscription" TEXT;

-- AlterTable
ALTER TABLE "NutritionistProfile" DROP COLUMN "clientProfileId",
ADD COLUMN     "certification" TEXT,
ADD COLUMN     "experienceYears" INTEGER;
