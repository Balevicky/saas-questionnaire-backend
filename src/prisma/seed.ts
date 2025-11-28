import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// const Role = {
//   ADMIN: "ADMIN",
//   AGENT: "AGENT",
//   SUPERVISEUR: "SUPERVISEUR",
// } as const;

async function main() {
  console.log("🚀 Début du seeding...");

  // ===========================
  // 1️⃣ Tenant par défaut
  // ===========================
  const tenant = await prisma.tenant.upsert({
    where: { slug: "default-tenant" },
    update: {},
    create: {
      name: "Tenant Principal",
      slug: "default-tenant",
    },
  });

  console.log("✅ Tenant prêt :", tenant.name);

  // ===========================
  // 2️⃣ Utilisateurs / rôles
  // ===========================
  const adminPassword = await bcrypt.hash("admin123", 10);
  const agentPassword = await bcrypt.hash("agent123", 10);
  const superviseurPassword = await bcrypt.hash("super123", 10);

  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      fullname: "Administrateur système",
      email: "admin@admin.com",
      password: adminPassword,
      role: Role.ADMIN,
      tenantId: tenant.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "agent@terrain.com" },
    update: {},
    create: {
      fullname: "Agent Terrain",
      email: "agent@terrain.com",
      password: agentPassword,
      role: Role.AGENT,
      tenantId: tenant.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "superviseur@terrain.com" },
    update: {},
    create: {
      fullname: "Superviseur Terrain",
      email: "superviseur@terrain.com",
      password: superviseurPassword,
      role: Role.SUPERVISEUR,
      tenantId: tenant.id,
    },
  });

  console.log("✅ Utilisateurs seedés");

  // ===========================
  // 3️⃣ Hiérarchie géographique
  // ===========================
  const region = await prisma.region.upsert({
    where: { name: "Cacheu" },
    update: {},
    create: { name: "Cacheu" },
  });

  // const departement = await prisma.departement.upsert({
  //   where: { name: "Cacheu Centre" },
  //   update: {},
  //   create: {
  //     name: "Cacheu Centre",
  //     regionId: region.id,
  //   },
  // });
  const departement = await prisma.departement.upsert({
    where: {
      name_regionId: {
        name: "Cacheu Centre",
        regionId: region.id,
      },
    },
    update: {},
    create: {
      name: "Cacheu Centre",
      regionId: region.id,
    },
  });

  // const secteur = await prisma.secteur.upsert({
  //   where: { name: "São Domingos" },
  //   update: {},
  //   create: {
  //     name: "São Domingos",
  //     departementId: departement.id,
  //   },
  // });
  const secteur = await prisma.secteur.upsert({
    where: {
      name_departementId: {
        name: "São Domingos",
        departementId: departement.id,
      },
    },
    update: {},
    create: {
      name: "São Domingos",
      departementId: departement.id,
    },
  });

  // const villages = ["Village A", "Village B", "Village C", "Village D"];

  // for (const villageName of villages) {
  //   await prisma.village.upsert({
  //     where: { name: villageName },
  //     update: {},
  //     create: {
  //       name: villageName,
  //       secteurId: secteur.id,
  //     },
  //   });
  // }
  const villages = ["Village A", "Village B", "Village C", "Village D"];

  for (const villageName of villages) {
    await prisma.village.upsert({
      where: {
        name_secteurId: {
          name: villageName,
          secteurId: secteur.id,
        },
      },
      update: {},
      create: {
        name: villageName,
        secteurId: secteur.id,
      },
    });
  }

  console.log("✅ Données géographiques seedées");
  console.log("🎉 Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur dans le seed :", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
