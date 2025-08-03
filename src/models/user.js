const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already exists"],
      required: [true, "Username is required"],
      trim: true,
      maxLength: [30, "Username cannot be more than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      maxLength: [100, "Email cannot be more than 100 characters"],
      lowercase: true,
      trim: true,
      validate: [
        function (value) {
          return validator.isEmail(value);
        },
        "Invalid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      validate: [
        function (value) {
          return validator.isStrongPassword(value);
        },
        "Please enter a strong password",
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = async function (password) {
  const encryptedPassword = this.password;
  const isValidPassword = await bcrypt.compare(password, encryptedPassword);
  return isValidPassword;
};

userSchema.methods.generateJwtToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
