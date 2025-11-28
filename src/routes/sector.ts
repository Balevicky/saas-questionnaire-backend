import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: AuthRequest, res) => {
  const sectors = await prisma.sector.findMany({
    where: { department: { region: { tenantId: req.user!.tenantId } } },
    include: { villages: true },
  });
  res.json(sectors);
});

router.post("/", async (req: AuthRequest, res) => {
  const { name, departmentId } = req.body;
  const sector = await prisma.sector.create({
    data: { name, departmentId },
  });
  res.json(sector);
});

export default router;
