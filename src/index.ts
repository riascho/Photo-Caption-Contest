import express from "express";
import session from "express-session";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Caption } from "./entity/Caption";
import { Image } from "./entity/Image";
import { compareHash, generateHash } from "./authentication";

const app = express(); // creating express app
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs"); // sets EJS as the view engine
app.set("views", path.join(__dirname, "../views")); // sets the views directory
app.use(expressLayouts); // enables layout support
app.set("layout", "layout"); // sets layout.ejs as the default layout

// Middleware
app.use(express.json()); // for API requests
app.use(express.urlencoded({ extended: true })); // for HTML form submissions
app.use(express.static(path.join(__dirname, "../public"))); // serves static files from the public directory

// Session configuration
const sessionOptions: session.SessionOptions = {
  name: "connect.sid", // default cookie name
  secret: process.env.SESSION_SECRET || "default_secret", // should be set in environment variable for production
  resave: false,
  saveUninitialized: false,
  store: new session.MemoryStore(), // In production, use a more robust session store like connect-redis
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production (requires HTTPS)
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: "strict",
  },
};
app.use(session(sessionOptions));

declare module "express-session" { // extends the SessionData interface to include our custom properties
  interface SessionData {
    userId?: number;
    userName?: string;
  }
}

// Initialize database
AppDataSource.initialize() // connects to db using config from data-source.ts
  .then(async () => {
    console.log("Database connection established");

    const imageRepository = AppDataSource.getRepository(Image);
    const userRepository = AppDataSource.getRepository(User);
    const captionRepository = AppDataSource.getRepository(Caption);

    // View Routes

    // Home page - display all images
    app.get("/", async (req, res) => {
      try {
        // typeorm transforms this into db query
        const images = await imageRepository.find({
          relations: ["captions", "captions.user"],
          order: { id: "ASC" },
        });
        // returns in the following structure:
        /**
        * [
            {
              id: 1,
              url: "https://media.istockphoto.com/...",
              captions: [
                {
                  id: 1,
                  text: "When you forget your umbrella...",
                  user: { id: 1, userName: "john_doe", email: "..." }
                }
              ]
            },
            // ... more images
          ]
         */
        res.render("index", {
          images,
          userId: req.session.userId,
        }); // EJS template renders
      } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).render("error", {
          message: "Failed to load images",
        });
      }
    });

    // Single image page
    app.get("/images/:id", async (req, res) => {
      try {
        const image = await imageRepository.findOne({
          where: { id: parseInt(req.params.id) },
          relations: ["captions", "captions.user"],
        });

        if (!image) {
          return res.status(404).render("error", {
            message: "Image not found",
          });
        }

        res.render("image", { image });
      } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).render("error", {
          message: "Failed to load image",
        });
      }
    });

    // Submit caption (form submission)
    app.post("/images/:id/captions", async (req, res) => {
      try {
        const { text, userId } = req.body;

        if (!text || !userId) {
          return res.status(400).render("error", {
            message: "Caption text and user ID are required",
          });
        }

        const image = await imageRepository.findOne({
          where: { id: parseInt(req.params.id) },
        });

        if (!image) {
          return res.status(404).render("error", {
            message: "Image not found",
          });
        }

        const user = await userRepository.findOne({
          where: { id: parseInt(userId) },
        });

        if (!user) {
          return res.status(404).render("error", {
            message: "User not found",
          });
        }

        const caption = captionRepository.create({
          text,
          user,
          image,
        });

        await captionRepository.save(caption);

        res.redirect(`/images/${req.params.id}`);
      } catch (error) {
        console.error("Error creating caption:", error);
        res.status(500).render("error", {
          message: "Failed to submit caption",
        });
      }
    });

    // Authentication Routes

    // Registration
    app.get("/register", (_req, res) => {
      res.render("registration");
    });

    app.post("/register", async (req, res) => {
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
    app.get("/login", async (_req, res) => {
      res.render("login");
    });
    app.post("/login", async (req, res) => {
      try {
        const { userName, password } = req.body;
        const user = await userRepository.findOne({
          where: { userName },
        });
        if (user && (await compareHash(password, user?.password))) {
          // store session
          req.session.userId = user.id;
          req.session.userName = user.userName;
          console.log(req.session);
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
    app.post("/logout", async (req, res) => {
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

    // API Routes

    // TODO: when user is logged in => req.session.userId === user.id => show user specific content

    // Get all images
    app.get("/api/images", async (req, res) => {
      try {
        const images = await imageRepository.find({
          relations: ["captions", "captions.user"],
        });
        res.json(images);
      } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: "Failed to fetch images" });
      }
    });

    // Get a single image with its captions
    app.get("/api/images/:id", async (req, res) => {
      try {
        const image = await imageRepository.findOne({
          where: { id: parseInt(req.params.id) },
          relations: ["captions", "captions.user"],
        });

        if (!image) {
          return res.status(404).json({ error: "Image not found" });
        }

        res.json(image);
      } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).json({ error: "Failed to fetch image" });
      }
    });

    // Submit a caption for an image
    app.post("/api/images/:id/captions", async (req, res) => {
      try {
        const { text, userId } = req.body;

        if (!text || !userId) {
          return res
            .status(400)
            .json({ error: "Text and userId are required" });
        }

        const image = await imageRepository.findOne({
          where: { id: parseInt(req.params.id) },
        });

        if (!image) {
          return res.status(404).json({ error: "Image not found" });
        }

        const user = await userRepository.findOne({
          where: { id: userId },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const caption = captionRepository.create({
          text,
          user,
          image,
        });

        await captionRepository.save(caption);

        res.status(201).json(caption);
      } catch (error) {
        console.error("Error creating caption:", error);
        res.status(500).json({ error: "Failed to create caption" });
      }
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });
