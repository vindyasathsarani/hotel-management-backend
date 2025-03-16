import User from "../models/userModels.js";
import Otp from "../models/otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export function postUsers(req, res) {
  const user = req.body;

  const password = req.body.password;

  const saltRounds = 10;

  const passwordHash = bcrypt.hashSync(password, saltRounds);

  console.log(passwordHash);

  user.password = passwordHash;

  const newUser = new User(user);
  newUser
    .save()
    .then(() => {
      //1000 - 9999 random number
      const otp = Math.floor(1000 + Math.random() * 9000);

      const newOtp = new Otp({
        email: user.email,
        otp: otp
      })
      newOtp.save().then(() => {
        sendOtpEmail(user.email,otp);
        res.json({
          message: "User created successfully",
        });
      })
      
    })
    .catch(() => {
      res.json({
        message: "User creation failed",
      });
    });
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

    const passwordMatch = bcrypt.compareSync(
      credentials.password,
      user.password
    );
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
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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

export function getAllUsers(req, res) {
  // Validate admin
  if (!isAdminValid(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  // Extract page and pageSize from query parameters
  const page = parseInt(req.body.page) || 1; // Default to page 1
  const pageSize = parseInt(req.body.pageSize) || 10; // Default to 10 items per page
  const skip = (page - 1) * pageSize;

  User.find()
    .skip(skip)
    .limit(pageSize)
    .then((users) => {
      User.countDocuments().then((totalCount) => {
        res.json({
          message: "Users found",
          users: users,
          pagination: {
            currentPage: page,
            pageSize: pageSize,
            totalUsers: totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
          },
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error fetching users",
        error: err,
      });
    });
}

export function sendOtpEmail(email,otp) {
  

  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const message = {
    from : "qscore100@gmail.com",
    to : email,
    subject : "Validating OTP",
    text : "Your otp code is "+otp
  }

  transport.sendMail(message, (err, info) => {
    if(err){
      console.log(err);     
    }else{
      console.log(info)
    }
  });
}

export function verifyUserEmail(req, res){
  const otp = req.body.otp
  const email = req.body.email

  Otp.find({email : email}).sort({date : -1}).then((otpList)=>{
    if(otpList.length == 0){
      res.json({
        message : "Otp is invalid"
      })
    }else{
      const latestOtp = otpList[0];
      if(latestOtp.otp == otp){
        User.findOneAndUpdate({email : email},{emailVerified : true}).then(() => {
          res.json({
            message : "User email verified successfully"
          });
        });
      }else{
        res.json({
          message : "Otp is invalid"
        });
    }
  }
})
}