import express from "express";

import * as authController from "../controllers/auth.controller.js";
import * as authValidator from "../validators/auth.validator.js";
import { validateRequest, verifyToken } from "../middleware/index.js";

const router = express.Router();

router.post(
  "/login",
  authValidator.loginValidator,
  validateRequest,
  authController.login,
);
router.post(
  "/signup",
  authValidator.createUserValidator,
  validateRequest,
  authController.signup,
);
router.get("/profile", verifyToken, authController.getProfile);

export default router;
