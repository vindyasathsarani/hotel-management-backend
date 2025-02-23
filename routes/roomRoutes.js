import express from "express";
import {
  createRoom,
  deleteRoom,
  findRoomById,
  getRooms,
  getRoomsByCategory,
  updateRoom,
} from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.delete("/:roomId", deleteRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/by-category/:category", getRoomsByCategory)
roomRouter.get("/:roomId", findRoomById);
roomRouter.put("/:roomId", updateRoom);

export default roomRouter;
