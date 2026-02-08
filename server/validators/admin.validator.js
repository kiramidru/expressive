import { body } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("parentId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Parent ID must be a positive integer")
    .toInt(),
];

export const retrieveUserValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .toLowerCase(),
];
