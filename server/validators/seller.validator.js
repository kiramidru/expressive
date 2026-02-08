import { body, query } from "express-validator";

export const createBrandValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("websiteUrl")
    .optional()
    .isURL()
    .withMessage("Website URL is not a valid URL"),
  body("logoUrl").optional().isURL().withMessage("logo URL is not a valid URL"),
];

export const retrieveBrandValidator = [];

export const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is Required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("brandId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Brand ID must be a positive integer")
    .toInt(),
  body("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer")
    .toInt(),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be zero or greater")
    .toFloat(),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isInt({ min: 0 })
    .withMessage("Amount must be a non-negative integer")
    .toInt(),
];

export const retrieveProductValidator = [
  query("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer")
    .toInt(),
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
    .isIn(["PENDING", "PROCESSING", "SHIPPED", "CANCELLED"])
    .withMessage(
      "Status must be one of: PENDING, PROCESSING, SHIPPED, or CANCELLED",
    ),
];
