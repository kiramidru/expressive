import express from "express";

import * as sellerValidator from "../validators/seller.validator.js";
import * as sellerController from "../controllers/seller.controller.js";
import { isSeller, validateRequest, verifyToken } from "../middleware/index.js";

const router = express.Router();

router.use(verifyToken, isSeller);

router.post(
  "/brand",
  sellerValidator.createBrandValidator,
  validateRequest,
  sellerController.CreateBrand,
);

router.post(
  "/product",
  sellerValidator.createProductValidator,
  validateRequest,
  sellerController.CreateProduct,
);

router.get(
  "/product",
  sellerValidator.retrieveProductValidator,
  validateRequest,
  sellerController.getFilteredProducts,
);

router.get(
  "/order",
  sellerValidator.retrieveOrderValidator,
  validateRequest,
  sellerController.getFilteredOrders,
);

router.patch(
  "/order",
  sellerValidator.updateOrderValidator,
  validateRequest,
  sellerController.updateOrder,
);

export default router;
