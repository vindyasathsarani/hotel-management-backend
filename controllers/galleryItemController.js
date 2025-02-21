import GalleryItem from "../models/galleryItemModels.js"

export function createGalleryItem(req, res) {

    const user = req.user
    if(user == null){
        res.status(403).json({
            message : "Please login to create a gallery item"
        })
        return
    }
    if(user.type != "admin"){
        res.status(403).json({
            message : "You are not authorized to create a gallery item"
        })
        return
    }
    
    const galleryItem = req.body

    const newGalleryItem = new GalleryItem(galleryItem)

    newGalleryItem.save().then(
        ()=>{
            res.json({
                message : "Gallery item created successfully"
            })
        }
    ).catch(
        ()=>{
            res.status(500).json({
                message : "Gallery item creation failed"
            })
        }
    )
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