import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export async function postUsers(req, res) {
  try {
    const user = req.body;
    const password = req.body.password;

    const passwordHash = bcrypt.hashSync(password, 10);
    user.password = passwordHash;

    const newUser = new User(user);
    await newUser.save();

    res.json({
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "User Creation Failed",
      error: error.message,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const credentials = req.body;
    const user = await User.findOne({ email: credentials.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatch = bcrypt.compareSync(credentials.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "User found",
      user: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export function isAdminValid(req) {
  console.log("User in Request:", req.user); // Debugging

  if (!req.user) {
    console.log("No user found in request");
    return false;
  }

  if (req.user.type !== "admin") {
    console.log("User is not an admin");
    return false;
  }

  return true;
}


export function isCustomerValid(req) {
  if (!req.user || req.user.type !== "customer") {
    return false;
  }
  return true;
}

export function getUser(req, res) {
  try {
    const user = req.body.user;
    if (!user) {
      return res.json({
        message: "not found",
      });
    }
    res.json({
      message: "found",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
}
