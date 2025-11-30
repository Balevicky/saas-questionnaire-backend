// src/middleware/tenant.middleware.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const slug = req.params.tenant;

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
  });

  if (!tenant) {
    return res.status(404).json({ error: "Tenant introuvable" });
  }

  (req as any).tenantId = tenant.id;
  (req as any).tenantSlug = tenant.slug;

  next();
}
