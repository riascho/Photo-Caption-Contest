import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const captionTextValidator = body("text")
  .trim()
  .isLength({ min: 1, max: 280 })
  .withMessage("Caption must be between 1 and 280 characters.")
  .escape();

export async function validateAndSanitizeCaptionInput(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  await captionTextValidator.run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.originalUrl.startsWith("/api/")) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    res.status(400).render("error", {
      message: errors.array()[0].msg,
    });
    return;
  }

  next();
}
