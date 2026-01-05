import express from "express";

import * as sellerValidator from "../validators/seller.validator.js";
import * as sellerController from "../controllers/seller.controller.js";

const router = express.Router();

router.post(
  "/brand",
  sellerValidator.createBrandValidator,
  sellerController.CreateBrand,
);

router.post(
  "/product",
  sellerValidator.createProductValidator,
  sellerController.CreateProduct,
);

router.get(
  "/product",
  sellerValidator.retrieveProductValidator,
  sellerController.getFilteredProducts,
);

router.get(
  "/order",
  sellerValidator.retrieveOrderValidator,
  sellerController.getFilteredOrders,
);

router.patch(
  "/order",
  sellerValidator.updateOrderValidator,
  sellerController.updateOrder,
);

export default router;
