import express from "express";

import * as adminValidator from "../validators/admin.validator.js";
import * as adminController from "../controllers/admin.controller.js";

const router = express.Router();

router.post(
  "/category",
  adminValidator.createCategoryValidator,
  adminController.createCategory,
);

router.post(
  "/verify",
  adminValidator.retrieveUserValidator,
  adminController.verifyUser,
);

export default router;
