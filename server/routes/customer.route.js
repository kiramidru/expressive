import express from "express";

import * as customerValidator from "../validators/customer.validator.js";
import * as customerController from "../controllers/customer.controller.js";

const router = express.Router();

router.post(
  "/order",
  customerValidator.createOrderValidator,
  customerController.CreateOrder,
);

router.get(
  "/order",
  customerValidator.retrieveOrderValidator,
  customerController.getFilteredOrders,
);

router.patch(
  "/order",
  customerValidator.updateOrderValidator,
  customerController.updateOrder,
);

router.get(
  "/product",
  customerValidator.retrieveProductValidator,
  customerController.getFilteredProducts,
);

router.get(
  "/profile",
  customerValidator.retrieveProductValidator,
  customerController.getProfile,
);
export default router;
