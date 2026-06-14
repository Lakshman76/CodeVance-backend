const bcrypt = require("bcrypt");
const User = require("../models/user");
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    });
    await user.save();
    res.send("User created successfully!!");
  } catch (error) {
    res.status(400).send("Failed to create user: " + error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }
    const token = await user.generateJwtToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.send("Login Successful!!");
  } catch (error) {
    res.status(400).send("Failed to login user: " + error.message);
  }
};
const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });
  res.send("Logout Successful!!");
};

const profile = async (req, res) => {
  res.send(req.user);
};

module.exports = {
  signup,
  login,
  logout,
  profile,
};
