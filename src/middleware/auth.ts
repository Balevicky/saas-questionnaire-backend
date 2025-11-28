// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

export interface AuthPayload {
  userId: string;
  tenantId: string;
  role?: string;
  tenantSlug?: string;
}

export interface AuthRequest extends Request {
  auth?: AuthPayload;
  tenant?: {
    id: string;
    slug: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * 🔐 Middleware d'authentification JWT + vérification multi-tenant par URL
 */
export async function authenticateJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const token = header.split(" ")[1];

    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;

    const tenantSlug = req.params.tenant;

    if (!tenantSlug) {
      return res.status(400).json({ error: "Tenant manquant dans l'URL" });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant inconnu" });
    }

    // ✅ Vérification : Token correspond au bon tenant ?
    if (payload.tenantId !== tenant.id) {
      return res.status(403).json({
        error: "Accès interdit : token ne correspond pas à ce tenant",
      });
    }

    req.auth = payload;
    req.tenant = {
      id: tenant.id,
      slug: tenant.slug,
    };

    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

/**
 * Middleware pour s'assurer que l'utilisateur a un rôle parmi la liste autorisée.
 * Usage: requireRole('ADMIN') ou requireRole('ADMIN', 'SUPERVISEUR')
 */
export const requireRole = (...allowed: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ error: "Non authentifié" });

    if (!allowed.includes(req.auth.role || "")) {
      return res.status(403).json({
        error: "Accès refusé — rôle insuffisant",
      });
    }

    next();
  };
};

/**
 * Helper pour récupérer tenantId en toute sécurité.
 * Exemple d'utilisation : const tenantId = ensureTenant(req);
 */
export function ensureTenant(req: AuthRequest) {
  if (!req.tenant) {
    throw new Error("Tenant non détecté");
  }

  return req.tenant.id;
}
