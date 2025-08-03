const express = require("express");
const { signup, login, logout } = require("../controllers/auth");
const isLoggedIn = require("../middleware/auth");

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", isLoggedIn, logout);

module.exports = route;
