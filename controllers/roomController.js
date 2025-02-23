import Room from "../models/roomModels.js";
import { isAdminValid } from "./userControllers.js";

export function createRoom(req, res) {
  if (!isAdminValid(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  const newRoom = new Room(req.body);
  newRoom
    .save()
    .then((result) => {
      res.json({
        message: "Room created successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.json({
        message: "Room creation failed",
        error: err,
      });
    });
}

export function deleteRoom(req, res) {
  if (!isAdminValid(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }
  const roomId = req.params.roomId;

  Room.findOneAndDelete({ roomId: roomId })
    .then(() => {
      res.json({
        message: "Room deleted successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "Room deletion failed",
      });
    });
}

export function findRoomById(req, res) {
  const roomId = req.params.roomId;
  Room.findOne({ roomId: roomId })
    .then((result) => {
      if (result == null) {
        res.status(404).json({
          message: "Room not found",
        });
        return;
      } else {
        res.json({
          message: "Room found",
          result: result,
        });
      }
    })
    .catch((err) => {
      res.json({
        message: "Room search failed",
        error: err,
      });
    });
}

export function getRooms(req, res) {
  Room.find()
    .then((result) => {
      res.json({
        rooms: result,
      });
    })
    .catch(() => {
      res.json({
        message: "Failed to get rooms",
      });
    });
}

export function updateRoom(req, res) {
  if (!isAdminValid(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  const roomId = req.params.roomId;

  Room.findOneAndUpdate(
    {
      roomId: roomId,
    },
    req.body
  )
    .then(() => {
      res.json({
        message: "Room updated successfully",
      });
    })
    .catch(() => {
      res,
        json({
          message: "Room update failed",
        });
    });
}
