const User = require("../models/User.js");
const { generateToken } = require("../functions/generateToken.js");
const bcryptjs = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// const jwt = require("jsonwebtoken");

// const generateToken = (id) => {
//   const generatedJWT = jwt.sign({ id }, process.env.JWT_SALT, {
//     expiresIn: "10d",
//   });
//   return generatedJWT;
// };
// registration
// @ POST /users
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.send(400);
    throw new Error("User already exist");
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const user = await User.create({
    userName: userName,
    email: email,
    password: hashedPassword,
    role: "simple",
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      userName: user.userName,
      email: user.email,
      token: generateToken(user.id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("User was not created, Invalid data");
  }
});

// LOGIn
// @ POST /users

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcryptjs.compare(password, user.password))) {
    res.json({
      _id: user.id,
      email: user.email,
      token: generateToken(user.id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// GET custom user
// @ GET /users/:id

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// GEt user list
// @GET /users/all

const getAllUsers = asyncHandler(async (req, res) => {
  const usersList = await User.find();

  res.status(200).json(usersList);
});

// get all users with their ads
// GET /user/list
const getAllUsersList = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "ads",
        localField: "_id",
        foreignField: "user",
        as: "ads",
      },
    },
    { $match: { role: { $in: ["simple", "admin"] } } },
    { $unset: ["ads.user", "ads.__v", "__v"] },
  ]);
  res.status(200).json(users);
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  getAllUsersList,
};
