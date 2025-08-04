const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const generatedJWT = jwt.sign({ id }, process.env.JWT_SALT, {
    expiresIn: "10d",
  });
  return generatedJWT;
};

module.exports = { generateToken };
