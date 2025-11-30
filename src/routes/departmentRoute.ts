// src/routes/territoire.routes.ts
import { Router } from "express";
import { tenantMiddleware } from "../middleware/tenant.middleware";
import { authenticateJWT } from "../middleware/auth";

import { DepartementController } from "../controllers/departementController";

const router = Router();

router.use("/:tenant", tenantMiddleware, authenticateJWT);

// DEPARTEMENT
router.post("/:tenant/departements", DepartementController.create);
router.get(
  "/:tenant/departements",
  authenticateJWT,
  DepartementController.list
);
router.patch(
  "/:tenant/departements/:id",
  authenticateJWT,
  DepartementController.update
);
router.delete(
  "/:tenant/departements/:id",
  authenticateJWT,
  DepartementController.delete
);

module.exports = router;
