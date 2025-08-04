const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const getUser = async (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Bearer jdfhgsidfhgstg.kwrhgfloaHERGOJAERG.ALKWREGHAGH
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return { status: 401, response: process.env.NOT_AUTHORIZED_NO_TOKEN };
      }

      const decoded = jwt.verify(token, process.env.JWT_SALT);

      const user = await User.findById(decoded.id).select("-password");

      return { status: 200, response: user };
    } catch (err) {
      return { status: 401, response: process.env.NOT_AUTHORIZED };
    }
  }
  return { status: 401, response: process.env.NOT_AUTHORIZED };
};

module.exports = { getUser };
