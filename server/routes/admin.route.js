import express from "express";

import * as adminValidator from "../validators/admin.validator.js";
import * as adminController from "../controllers/admin.controller.js";
import { isAdmin, validateRequest, verifyToken } from "../middleware/index.js";

const router = express.Router();

router.post(
  "/category",
  verifyToken,
  isAdmin,
  adminValidator.createCategoryValidator,
  validateRequest,
  adminController.createCategory,
);

router.post(
  "/verify",
  verifyToken,
  isAdmin,
  adminValidator.retrieveUserValidator,
  validateRequest,
  adminController.verifyUser,
);

export default router;
