import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const saltRounds = 10;

export async function generateHash(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function compareHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

const registerValidators = [
  body("userName")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters.")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number."),
];

export async function validateRegistrationInput(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  for (const validator of registerValidators) {
    await validator.run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).render("error", {
      message: errors.array()[0].msg,
    });
    return;
  }

  next();
}