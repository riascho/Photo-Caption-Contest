// HTML page routes

import {
  imageRepository,
  userRepository,
  captionRepository,
} from "../repositories";
import { dbCache } from "../cache";
import { Router } from "express";
export const viewsRouter = Router();

// VIEW ROUTES

// Home page - display all images
viewsRouter.get("/", async (req, res) => {
  try {
    const cachedData = dbCache.get("images");
    let images;
    if (cachedData) {
      images = cachedData;
    } else {
      images = await imageRepository.find({
        relations: ["captions", "captions.user"],
        order: { id: "ASC" },
      });
      dbCache.set("images", images);
    }
    res.status(200).render("index", { images });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).render("error", {
      message: "Failed to load images",
    });
  }
});

viewsRouter.get("/images/:id", async (req, res) => {
  try {
    const cachedData = dbCache.get(`image_${req.params.id}`);
    let image;
    if (cachedData) {
      image = cachedData;
    } else {
      image = await imageRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ["captions", "captions.user"],
      });
      if (!image) {
        return res.status(404).render("error", {
          message: "Image not found",
        });
      }
      dbCache.set(`image_${req.params.id}`, image);
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

    const cachedData = dbCache.get(`image_${req.params.id}`);
    let image;
    if (cachedData) {
      image = cachedData;
    } else {
      image = await imageRepository.findOne({
        where: { id: parseInt(req.params.id) },
      });
      if (!image) {
        return res.status(404).render("error", {
          message: "Image not found",
        });
      }
      dbCache.set(`image_${req.params.id}`, image);
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
    dbCache.del(`image_${req.params.id}`); // refresh cache for this image because we have a new caption to load
    dbCache.del("images"); // refresh cache for the home page because we have a new caption to load
    res.redirect(`/images/${req.params.id}`);
  } catch (error) {
    console.error("Error creating caption:", error);
    res.status(500).render("error", {
      message: "Failed to submit caption",
    });
  }
});
