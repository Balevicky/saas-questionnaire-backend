/*
  Warnings:

  - Made the column `tenantId` on table `Departement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tenantId` on table `Region` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tenantId` on table `Secteur` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tenantId` on table `Village` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Departement" ALTER COLUMN "tenantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Region" ALTER COLUMN "tenantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Secteur" ALTER COLUMN "tenantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Village" ALTER COLUMN "tenantId" SET NOT NULL;
