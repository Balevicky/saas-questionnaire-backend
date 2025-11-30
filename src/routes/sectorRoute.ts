// src/routes/territoire.routes.ts
import { Router } from "express";
import { tenantMiddleware } from "../middleware/tenant.middleware";
import { authenticateJWT } from "../middleware/auth";

import { SecteurController } from "../controllers/secteurController";

const router = Router();

router.use("/:tenant", tenantMiddleware, authenticateJWT);

// SECTEUR
router.post("/:tenant/secteurs", SecteurController.create);
router.get("/:tenant/secteurs", SecteurController.list);
router.patch("/:tenant/secteurs/:id", SecteurController.update);
router.delete("/:tenant/secteurs/:id", SecteurController.delete);

module.exports = router;
