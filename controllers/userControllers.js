import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()


export function postUsers(req, res) {
  const user = req.body;

  const password = req.body.password;

  const passwordHash = bcrypt.hashSync(password, 10);

  user.password = passwordHash;

  const newUser = new User(user);
  newUser
    .save()
    .then(() => {
      res.json({
        message: "User Created Successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "User Creation Failed",
      });
    });
}

export function loginUser(req, res) {
  const credentials = req.body;

  User.findOne({
    email: credentials.email, 
  }).then((user) => {
    if (user == null) {
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
  }).catch((err) => {
    res.status(500).json({ message: "Internal server error" });
  });
}
