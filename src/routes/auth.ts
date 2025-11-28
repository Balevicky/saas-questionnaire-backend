// src/routes/auth.ts
import { Router, Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import { log } from "console";

dotenv.config();

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

interface TokenPayload {
  userId: string;
  tenantId: string;
  role: Role;
}
function getRefreshTokenExpiry(days: number = 7): Date {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
}

/**
 * ============================
 * SIGNUP (Créer tenant + admin)
 * ============================
 */
router.post("/:tenant/auth/signup", async (req: Request, res: Response) => {
  // router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { tenantName, tenantSlug, email, password, fullname } = req.body;
    const tenantSlugs = req.params.tenant;
    console.log("req.params:" + req.params);
    if (!tenantName || !tenantSlug || !email || !password) {
      return res.status(400).json({ error: "Champs manquants" });
    }
    // Vérifier si utilisateur existe déjà

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(409).json({ error: "Utilisateur déjà existant" });

    // Créer ou récupérer le tenant
    const tenant = await prisma.tenant.upsert({
      where: { slug: tenantSlug },
      update: {},
      create: { name: tenantName, slug: tenantSlug },
    });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullname: fullname || "Admin",
        email,
        password: hashed,
        role: Role.ADMIN,
        tenantId: tenant.id,
      },
    });

    const payload: TokenPayload = {
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // ✅ Stocker le refresh token en base
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        tenantId: tenant.id,
        expiresAt: getRefreshTokenExpiry(7),
      },
    });

    res.json({
      message: "Inscription réussie",
      token,
      refreshToken,
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur signup:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * ============================
 * LOGIN
 * ============================
 */
// router.post("/login", async (req: Request, res: Response) => {
//localhost:4000/api/boli/auth/login
router.post("/:tenant/auth/login", async (req: Request, res: Response) => {
  http: try {
    const { email, password } = req.body;
    const tenantSlug = req.params.tenant;
    console.log("req.params:" + req.params);
    console.log("tenantSlug:" + tenantSlug);

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });
    if (!tenant) return res.status(404).json({ error: "Tenant inconnu" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.tenantId !== tenant.id)
      return res
        .status(401)
        .json({ error: "Utilisateur non trouvé pour ce tenant" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Mot de passe incorrect" });

    const payload: TokenPayload = {
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    // ✅ Sauvegarde du refresh token en base
    // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        tenantId: tenant.id,
        expiresAt: getRefreshTokenExpiry(7),
      },
    });

    res.json({
      message: "Connexion réussie",
      token,
      refreshToken,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    // res.status(500).json({ error: "Erreur serveur" });
    res.status(500).json({ error: error });
  }
});

/**
 * ============================
 * REFRESH TOKEN
 * ============================
 */
router.post("/:tenant/auth/refresh", async (req: Request, res: Response) => {
  // router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tenantSlug = req.params.tenant;

  if (!refreshToken)
    return res.status(400).json({ error: "refreshToken manquant" });

  try {
    // 1️⃣ Vérif dans la DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken)
      return res.status(401).json({ error: "Refresh token inconnu" });

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });
    if (!tenant) return res.status(404).json({ error: "Tenant inconnu" });

    if (storedToken.tenantId !== tenant.id)
      return res
        .status(403)
        .json({ error: "Token ne correspond pas à ce tenant" });

    if (storedToken.expiresAt < new Date())
      return res.status(401).json({ error: "Refresh token expiré" });

    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    ) as JwtPayload & TokenPayload;
    const newToken = jwt.sign(
      { userId: decoded.userId, tenantId: tenant.id, role: decoded.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, tenantId: tenant.id, role: decoded.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    // Rotation : supprimer l'ancien et créer le nouveau
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.userId,
        tenantId: tenant.id,
        expiresAt: getRefreshTokenExpiry(7),
      },
    });

    res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ error: "Refresh token invalide ou expiré" });
  }
});

/**
 * ============================
 * LOGOUT
 * ============================
 */
router.post(
  "/:tenant/auth/logout",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    // router.post("/logout",authenticateJWT,async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: "refreshToken manquant" });

    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    res.json({ message: "Déconnexion réussie" });
  }
);

export default router;
