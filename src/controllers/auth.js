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
    const isValidPassword = user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }
    const token = user.generateJwtToken();
    res.cookie("token", token);
    res.send("Login Successful!!");
  } catch (error) {
    res.status(400).send("Failed to login user: " + error.message);
  }
};
const logout = async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successful!!");
};

module.exports = {
  signup,
  login,
  logout,
};
