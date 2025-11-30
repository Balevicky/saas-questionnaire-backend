// src/routes/territoire.routes.ts
import { Router } from "express";
import { tenantMiddleware } from "../middleware/tenant.middleware";
import { authenticateJWT } from "../middleware/auth";

import { RegionController } from "../controllers/regionController";
// import { createRegion, getRegions } from "../controllers/regionController";
const router = Router();

router.use("/:tenant", tenantMiddleware, authenticateJWT);

// REGION
router.post("/:tenant/regions", RegionController.create);
router.get("/:tenant/regions", RegionController.list);
router.patch("/:tenant/regions/:id", RegionController.update);
router.delete("/:tenant/regions/:id", RegionController.delete);

module.exports = router;
