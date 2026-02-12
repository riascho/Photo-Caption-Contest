// Registration, Login & Logout routes

import { userRepository } from "../repositories";
import { Router } from "express";

import { compareHash, generateHash } from "../authentication";

export const authRouter = Router();

// Authentication Routes

// Registration
authRouter.get("/register", (_req, res) => {
  res.render("registration");
});

authRouter.post("/register", async (req, res) => {
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
    // TODO: handle duplicate email/userName error
    console.error("Error during registration:", error);
    res.status(500).render("error", {
      message: "Registration failed",
    });
  }
});

// Login
authRouter.get("/login", async (_req, res) => {
  res.render("login");
});
authRouter.post("/login", async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await userRepository.findOne({
      where: { userName },
    });
    if (user && (await compareHash(password, user?.password))) {
      // store session
      req.session.userId = user.id;
      req.session.userName = user.userName;
      console.log("Logged in:", req.session);
      res.redirect("/");
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
  console.log(`User ${req.session.userName} logged out`);
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
