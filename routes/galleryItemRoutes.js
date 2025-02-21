import express from "express";
import { createGalleryItem, getGalleryItem } from "../controllers/galleryItemController.js";

const galleryItemRouter = express.Router();

galleryItemRouter.post("/", createGalleryItem);
galleryItemRouter.get("/", getGalleryItem)

export default galleryItemRouter;
