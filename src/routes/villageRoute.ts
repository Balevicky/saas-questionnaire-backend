// src/routes/territoire.routes.ts
import { Router } from "express";
import { tenantMiddleware } from "../middleware/tenant.middleware";
import { authenticateJWT } from "../middleware/auth";

import { VillageController } from "../controllers/villageController";

const router = Router();

router.use("/:tenant", tenantMiddleware, authenticateJWT);

// VILLAGE
router.post("/:tenant/villages", authenticateJWT, VillageController.create);
router.get("/:tenant/villages", authenticateJWT, VillageController.list);
router.patch(
  "/:tenant/villages/:id",
  authenticateJWT,
  VillageController.update
);
router.delete(
  "/:tenant/villages/:id",
  authenticateJWT,
  VillageController.delete
);

module.exports = router;
