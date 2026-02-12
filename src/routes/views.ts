// HTML page routes

import {
  imageRepository,
  userRepository,
  captionRepository,
} from "../repositories";
import { Router } from "express";
export const viewsRouter = Router();

// VIEW ROUTES

// Home page - display all images
viewsRouter.get("/", async (req, res) => {
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
viewsRouter.get("/images/:id", async (req, res) => {
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
viewsRouter.post("/images/:id/captions", async (req, res) => {
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
