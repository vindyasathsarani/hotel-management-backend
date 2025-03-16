import express from "express";
import { createGalleryItem, deleteGalleryItem, getGalleryItem, updateGalleryItem } from "../controllers/galleryItemController.js";

const galleryItemRouter = express.Router();

galleryItemRouter.post("/", createGalleryItem);
galleryItemRouter.get("/", getGalleryItem);
galleryItemRouter.put("/:id", updateGalleryItem);
galleryItemRouter.delete("/:id", deleteGalleryItem);

export default galleryItemRouter;
