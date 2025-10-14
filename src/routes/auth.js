const express = require("express");
const { signup, login, logout, profile } = require("../controllers/auth");
const isLoggedIn = require("../middleware/auth");

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", isLoggedIn, logout);
route.get("/me", isLoggedIn, profile);

module.exports = route;
