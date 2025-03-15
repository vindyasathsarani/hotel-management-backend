import GalleryItem from "../models/galleryItemModels.js"


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
export function getGalleryItem(req, res){
    GalleryItem.find().then(
        (list)=>{
            res.json({
                list : list
            })
        }
    )
}

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

        // Find and delete the gallery item by id
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
