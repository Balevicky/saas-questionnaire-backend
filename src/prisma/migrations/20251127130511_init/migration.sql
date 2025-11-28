/*
  Warnings:

  - A unique constraint covering the columns `[name,regionId]` on the table `Departement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,departementId]` on the table `Secteur` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,secteurId]` on the table `Village` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Departement" DROP CONSTRAINT "Departement_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Secteur" DROP CONSTRAINT "Secteur_departementId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Village" DROP CONSTRAINT "Village_secteurId_fkey";

-- DropIndex
DROP INDEX "Departement_name_key";

-- DropIndex
DROP INDEX "Secteur_name_key";

-- DropIndex
DROP INDEX "Village_name_key";

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Departement_name_regionId_key" ON "Departement"("name", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "Secteur_name_departementId_key" ON "Secteur"("name", "departementId");

-- CreateIndex
CREATE UNIQUE INDEX "Village_name_secteurId_key" ON "Village"("name", "secteurId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departement" ADD CONSTRAINT "Departement_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secteur" ADD CONSTRAINT "Secteur_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Village" ADD CONSTRAINT "Village_secteurId_fkey" FOREIGN KEY ("secteurId") REFERENCES "Secteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
