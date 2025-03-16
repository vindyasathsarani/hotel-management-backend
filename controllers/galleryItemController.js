import GalleryItem from "../models/galleryItemModels.js";
import mongoose from "mongoose";

// Function to create a new gallery item
export function createGalleryItem(req, res) {
    try {
        const user = req.user;
        if (user == null) {
            return res.status(403).json({
                message: "Please login to create a gallery item",
            });
        }
        if (user.type != "admin") {
            return res.status(403).json({
                message: "You are not authorized to create a gallery item",
            });
        }

        const galleryItem = req.body;
        const newGalleryItem = new GalleryItem(galleryItem);

        newGalleryItem
            .save()
            .then(() => {
                res.json({
                    message: "Gallery item created successfully",
                });
            })
            .catch(() => {
                res.status(500).json({
                    message: "Gallery item creation failed",
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while creating the gallery item",
        });
    }
}

// Function to get all gallery items
export function getGalleryItem(req, res) {
    GalleryItem.find()
        .then((list) => {
            res.json({
                list: list,
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "An error occurred while fetching the gallery items",
                error: error.message,
            });
        });
}

// Function to delete a gallery item
export function deleteGalleryItem(req, res) {
    try {
        const user = req.user;
        if (user == null) {
            return res.status(403).json({
                message: "Please login to delete a gallery item",
            });
        }
        if (user.type != "admin") {
            return res.status(403).json({
                message: "You are not authorized to delete a gallery item",
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid gallery item ID",
            });
        }

        GalleryItem.findByIdAndDelete(id)
            .then((deletedItem) => {
                if (!deletedItem) {
                    return res.status(404).json({
                        message: "Gallery item not found",
                    });
                }
                res.json({
                    message: "Gallery item deleted successfully",
                });
            })
            .catch(() => {
                res.status(500).json({
                    message: "An error occurred while deleting the gallery item",
                });
            });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while deleting the gallery item",
        });
    }
}

// Function to update a gallery item
export function updateGalleryItem(req, res) {
    try {
        const user = req.user;
        if (user == null) {
            return res.status(403).json({
                message: "Please login to update a gallery item",
            });
        }
        if (user.type != "admin") {
            return res.status(403).json({
                message: "You are not authorized to update a gallery item",
            });
        }

        const { id } = req.params;  // Get the gallery item's ID from the URL parameters
        const updatedData = req.body; // The data to update

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid gallery item ID",
            });
        }

        GalleryItem.findByIdAndUpdate(id, updatedData, { new: true })
            .then((updatedItem) => {
                if (!updatedItem) {
                    return res.status(404).json({
                        message: "Gallery item not found",
                    });
                }
                res.json({
                    message: "Gallery item updated successfully",
                    updatedItem: updatedItem,
                });
            })
            .catch((error) => {
                console.error("Error updating gallery item:", error);
                res.status(500).json({
                    message: "An error occurred while updating the gallery item",
                    error: error.message,
                });
            });
    } catch (error) {
        console.error("Unexpected error:", error); 
        res.status(500).json({
            message: "An error occurred while updating the gallery item",
            error: error.message,
        });
    }
}
