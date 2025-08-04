const jwt = require("jsonwebtoken");
const User = require("../models/user");
const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token, Please login again!");
    }
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById({ _id: data._id });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = isLoggedIn;
