import express from "express";

import * as customerValidator from "../validators/customer.validator.js";
import * as customerController from "../controllers/customer.controller.js";
import { isCustomer, validateRequest, verifyToken } from "../middleware/index.js";

const router = express.Router();

router.use(verifyToken, isCustomer);

router.post(
  "/order",
  customerValidator.createOrderValidator,
  validateRequest,
  customerController.CreateOrder,
);

router.get(
  "/order",
  customerValidator.retrieveOrderValidator,
  validateRequest,
  customerController.getFilteredOrders,
);

router.patch(
  "/order",
  customerValidator.updateOrderValidator,
  validateRequest,
  customerController.updateOrder,
);

router.get(
  "/product",
  customerValidator.retrieveProductValidator,
  validateRequest,
  customerController.getFilteredProducts,
);

router.get(
  "/product/:id",
  customerValidator.retrieveProductByIdValidator,
  validateRequest,
  customerController.getProduct,
);
export default router;
