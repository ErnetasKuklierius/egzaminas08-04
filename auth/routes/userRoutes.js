const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  getAllUsersList,
} = require("../controllers/usersController.js");

const { protect } = require("../middleware/authMiddleware.js");
const { protectAdmin } = require("../middleware/adminAuthMiddleware.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, getUser);
router.get("/all", protectAdmin, getAllUsers);
router.get("/list", protectAdmin, getAllUsersList);

module.exports = router;
