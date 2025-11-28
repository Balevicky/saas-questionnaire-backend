import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: AuthRequest, res) => {
  const villages = await prisma.village.findMany({
    where: {
      sector: { department: { region: { tenantId: req.user!.tenantId } } },
    },
  });
  res.json(villages);
});

router.post("/", async (req: AuthRequest, res) => {
  const { name, sectorId } = req.body;
  const village = await prisma.village.create({
    data: { name, sectorId },
  });
  res.json(village);
});

export default router;
