import { body } from "express-validator";

export const createUserValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 72 })
    .withMessage("Password must be between 6 and 72 characters"),
  body("firstName")
    .notEmpty()
    .withMessage("First Name is required")
    .isString()
    .withMessage("First Name must be a string")
    .trim(),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last Name must be a string")
    .trim(),
  body("role")
    .optional()
    .isIn(["CUSTOMER", "SELLER"])
    .withMessage("Role must be one of: CUSTOMER, or SELLER"),
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ max: 72 })
    .withMessage("Password must be at most 72 characters"),
];
