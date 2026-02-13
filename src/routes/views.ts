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
    res.status(200).render("index", { images }); // EJS template renders
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).render("error", {
      message: "Failed to load images",
    });
  }
});

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

    res.status(200).render("image", { image });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).render("error", {
      message: "Failed to load image",
    });
  }
});

viewsRouter.post("/images/:id/captions", async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - please log in" });
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
      where: { id: userId },
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
