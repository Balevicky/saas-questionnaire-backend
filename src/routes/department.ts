import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

// Lister départements d'un tenant
router.get("/", async (req: AuthRequest, res) => {
  const departments = await prisma.department.findMany({
    where: { region: { tenantId: req.user!.tenantId } },
    include: { sectors: true },
  });
  res.json(departments);
});

// Créer un département
router.post("/", async (req: AuthRequest, res) => {
  const { name, regionId } = req.body;
  const dept = await prisma.department.create({
    data: { name, regionId },
  });
  res.json(dept);
});

export default router;
