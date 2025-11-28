import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

// Lister toutes les régions du tenant
router.get("/", async (req: AuthRequest, res) => {
  const regions = await prisma.region.findMany({
    where: { tenantId: req.user!.tenantId },
    include: { departments: true },
  });
  res.json(regions);
});

// Créer une région
router.post("/", async (req: AuthRequest, res) => {
  const { name } = req.body;
  const region = await prisma.region.create({
    data: { name, tenantId: req.user!.tenantId },
  });
  res.json(region);
});

export default router;
