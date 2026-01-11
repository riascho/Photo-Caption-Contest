import express from "express";
import path from "path";
import { AppDataSource } from "./data-source";
import { DatabaseConnection } from "./database-connection";
import { User } from "./entity/User";
import { Caption } from "./entity/Caption";
import { Image } from "./entity/Image";

const app = express(); // creating express app
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs"); // sets EJS as the view engine
app.set("views", path.join(__dirname, "../views")); // sets the views directory

// Middleware
app.use(express.json()); // for API requests
app.use(express.urlencoded({ extended: true })); // for HTML form submissions
app.use(express.static(path.join(__dirname, "../public"))); // serves static files from the public directory

// Initialize database and start server
const dbConnection = new DatabaseConnection();

async function startServer() {
  try {
    // Initialize database connection
    await dbConnection.init();

    // View Routes

    // Home page - display all images
    app.get("/", async (req, res) => {
      try {
        // typeorm transforms this into db query
        const imageRepository = AppDataSource.getRepository(Image);
        const images = await imageRepository.find({
          relations: ["captions", "captions.user"],
          order: { id: "DESC" },
        });
        // returns in the following structure:
        /**
                 * [
          {
            id: 3,
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
        res.render("index", { images }); // EJS template renders
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
        const imageRepository = AppDataSource.getRepository(Image);
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

        const imageRepository = AppDataSource.getRepository(Image);
        const userRepository = AppDataSource.getRepository(User);
        const captionRepository = AppDataSource.getRepository(Caption);

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

    // API Routes

    // Get all images
    app.get("/api/images", async (req, res) => {
      try {
        const imageRepository = AppDataSource.getRepository(Image);
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
        const imageRepository = AppDataSource.getRepository(Image);
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

        const imageRepository = AppDataSource.getRepository(Image);
        const userRepository = AppDataSource.getRepository(User);
        const captionRepository = AppDataSource.getRepository(Caption);

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
  } catch (error) {
    console.error("Error starting server:", error);
    await dbConnection.close();
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await dbConnection.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await dbConnection.close();
  process.exit(0);
});

startServer();
