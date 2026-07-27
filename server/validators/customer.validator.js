import { body, param, query } from "express-validator";

export const createOrderValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer")
    .toInt(),

  body("amount")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .toInt(),
];

export const retrieveOrderValidator = [
  query("productId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer")
    .toInt(),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer")
    .toInt(),
];

export const updateOrderValidator = [
  body("id")
    .notEmpty()
    .withMessage("ID is required")
    .isInt()
    .withMessage("ID must be a number")
    .toInt(),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .equals("CANCELLED")
    .withMessage("Customers can only cancel orders"),
];

export const retrieveProductValidator = [
  query("sellerId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Seller ID must be a positive integer")
    .toInt(),
  query("categoryName")
    .optional()
    .isString()
    .withMessage("Category name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer ")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer")
    .toInt(),
];

export const retrieveProductByIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer")
    .toInt(),
];
