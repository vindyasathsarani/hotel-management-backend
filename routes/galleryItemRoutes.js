import express from "express";
import { createGalleryItem, deleteGalleryItem, getGalleryItem } from "../controllers/galleryItemController.js";

const galleryItemRouter = express.Router();

galleryItemRouter.post("/", createGalleryItem);
galleryItemRouter.get("/", getGalleryItem)
galleryItemRouter.delete("/:id", deleteGalleryItem)

export default galleryItemRouter;
