/*
  Warnings:

  - A unique constraint covering the columns `[name,regionId,tenantId]` on the table `Departement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,tenantId]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,departementId,tenantId]` on the table `Secteur` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,secteurId,tenantId]` on the table `Village` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Departement" DROP CONSTRAINT "Departement_tenant_fkey";

-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_tenant_fkey";

-- DropForeignKey
ALTER TABLE "Secteur" DROP CONSTRAINT "Secteur_tenant_fkey";

-- DropForeignKey
ALTER TABLE "Village" DROP CONSTRAINT "Village_tenant_fkey";

-- DropIndex
DROP INDEX "Departement_name_regionId_key";

-- DropIndex
DROP INDEX "Region_name_key";

-- DropIndex
DROP INDEX "Secteur_name_departementId_key";

-- DropIndex
DROP INDEX "Village_name_secteurId_key";

-- AlterTable
ALTER TABLE "Departement" ALTER COLUMN "tenantId" DROP NOT NULL,
ALTER COLUMN "tenantId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Region" ALTER COLUMN "tenantId" DROP NOT NULL,
ALTER COLUMN "tenantId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Secteur" ALTER COLUMN "tenantId" DROP NOT NULL,
ALTER COLUMN "tenantId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Village" ALTER COLUMN "tenantId" DROP NOT NULL,
ALTER COLUMN "tenantId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Departement_name_regionId_tenantId_key" ON "Departement"("name", "regionId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_tenantId_key" ON "Region"("name", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Secteur_name_departementId_tenantId_key" ON "Secteur"("name", "departementId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Village_name_secteurId_tenantId_key" ON "Village"("name", "secteurId", "tenantId");

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departement" ADD CONSTRAINT "Departement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secteur" ADD CONSTRAINT "Secteur_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Village" ADD CONSTRAINT "Village_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
