// JSON API routes

import {
  imageRepository,
  userRepository,
  captionRepository,
} from "../repositories";
import { Router } from "express";
export const apiRouter = Router();

// API ROUTES

// Get all images
apiRouter.get("/images", async (req, res) => {
  try {
    const images = await imageRepository.find({
      relations: ["captions", "captions.user"],
    });
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

apiRouter.get("/images/:id", async (req, res) => {
  try {
    const image = await imageRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["captions", "captions.user"],
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.status(200).json(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

apiRouter.post("/images/:id/captions", async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.session.userId;

    if (!text) {
      return res.status(400).json({ error: "Caption text is required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - please log in" });
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
