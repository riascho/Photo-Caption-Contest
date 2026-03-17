// Registration, Login & Logout routes

import { userRepository } from "../repositories";
import { Router } from "express";
export const authRouter = Router();

import {
  compareHash,
  generateHash,
  validateRegistrationInput,
} from "../middleware/authentication";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter";

// Pre-computed bcrypt hash used as a dummy to prevent user enumeration via timing attacks.
// Always run compareHash so non-existent users take the same time as existing ones.
const DUMMY_HASH =
  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

// Authentication Routes

// Registration
authRouter.get("/register", (_req, res) => {
  res.status(200).render("registration");
});

authRouter.post("/register", registerLimiter, validateRegistrationInput, async (req, res) => {
  try {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const hash = await generateHash(password);

    const user = userRepository.create({
      userName,
      email,
      password: hash,
    });

    await userRepository.save(user);

    res.redirect("/login");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).render("error", {
      message: "Registration failed",
    });
  }
});

// Login
authRouter.get("/login", async (_req, res) => {
  res.status(200).render("login");
});
authRouter.post("/login", loginLimiter, async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await userRepository.findOne({
      where: { userName },
      select: ["id", "userName", "password"], // only select fields we need
    });
    // Always run compareHash regardless of whether user exists to prevent
    // user enumeration via timing attacks.
    const passwordMatch = await compareHash(
      password,
      user ? user.password : DUMMY_HASH,
    );
    if (user && passwordMatch) {
      // regenerate and store session
      req.session.regenerate((err) => {
        if (err) {
          console.error("Error during session regeneration:", err);
          return res.status(500).render("error", {
            message: "Login failed. Please refresh the page and try again.",
          });
        }
        req.session.userId = user.id;
        req.session.userName = user.userName;
        res.redirect("/");
      });
    } else {
      res.status(401).render("error", {
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).render("error", {
      message: "Login failed",
    });
  }
});

// Logout
authRouter.post("/logout", async (req, res) => {
  // clear session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).render("error", {
        message: "Logout failed",
      });
    }
    res.redirect("/");
  });
});
