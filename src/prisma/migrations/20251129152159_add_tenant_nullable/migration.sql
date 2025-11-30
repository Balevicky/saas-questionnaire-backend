-- 1️⃣ Créer un tenant par défaut si il n'existe pas
INSERT INTO "Tenant" (id, name, slug)
SELECT 'default-tenant-id', 'Tenant par défaut', 'default-tenant'
WHERE NOT EXISTS (SELECT 1 FROM "Tenant" WHERE slug='default-tenant');

-- 2️⃣ Ajouter tenantId temporairement NULLABLE aux tables
ALTER TABLE "Region" ADD COLUMN "tenantId" VARCHAR NULL;
ALTER TABLE "Departement" ADD COLUMN "tenantId" VARCHAR NULL;
ALTER TABLE "Secteur" ADD COLUMN "tenantId" VARCHAR NULL;
ALTER TABLE "Village" ADD COLUMN "tenantId" VARCHAR NULL;

-- 3️⃣ Remplir tenantId existant avec le tenant par défaut
UPDATE "Region" SET "tenantId" = 'default-tenant-id' WHERE "tenantId" IS NULL;
UPDATE "Departement" SET "tenantId" = 'default-tenant-id' WHERE "tenantId" IS NULL;
UPDATE "Secteur" SET "tenantId" = 'default-tenant-id' WHERE "tenantId" IS NULL;
UPDATE "Village" SET "tenantId" = 'default-tenant-id' WHERE "tenantId" IS NULL;

-- 4️⃣ Ajouter les contraintes de relation
ALTER TABLE "Region" ADD CONSTRAINT "Region_tenant_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"(id) ON DELETE CASCADE;
ALTER TABLE "Departement" ADD CONSTRAINT "Departement_tenant_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"(id) ON DELETE CASCADE;
ALTER TABLE "Secteur" ADD CONSTRAINT "Secteur_tenant_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"(id) ON DELETE CASCADE;
ALTER TABLE "Village" ADD CONSTRAINT "Village_tenant_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"(id) ON DELETE CASCADE;

-- 5️⃣ Optionnel : rendre tenantId NOT NULL si tu veux l’exiger
ALTER TABLE "Region" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Departement" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Secteur" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Village" ALTER COLUMN "tenantId" SET NOT NULL;
