import Room from "../models/roomModels.js";
import { isAdminValid } from "./userControllers.js";

export async function createRoom(req, res) {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const newRoom = new Room(req.body);
    const result = await newRoom.save();
    res.json({ message: "Room created successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Room creation failed", error: err.message });
  }
}

export async function deleteRoom(req, res) {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const roomId = req.params.roomId;
    await Room.findOneAndDelete({ roomId });
    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Room deletion failed", error: err.message });
  }
}

export async function findRoomById(req, res) {
  try {
    const roomId = req.params.roomId;
    const result = await Room.findOne({ roomId });

    if (!result) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ message: "Room found", result });
  } catch (err) {
    res.status(500).json({ message: "Room search failed", error: err.message });
  }
}

export async function getRooms(req, res) {
  try {
    const rooms = await Room.find();
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ message: "Failed to get rooms", error: err.message });
  }
}

export async function updateRoom(req, res) {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const roomId = req.params.roomId;
    await Room.findOneAndUpdate({ roomId }, req.body);
    res.json({ message: "Room updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Room update failed", error: err.message });
  }
}

export async function getRoomsByCategory(req, res) {
  try {
    const category = req.params.category;
    const rooms = await Room.find({ category });
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ message: "Failed to get rooms", error: err.message });
  }
}
