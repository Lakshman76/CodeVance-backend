const express = require("express");
const authRoutes = require("./routes/auth");
const compilerRoutes = require("./routes/compilerRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/compiler", compilerRoutes);

module.exports = app;
