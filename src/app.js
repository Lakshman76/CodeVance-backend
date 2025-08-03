const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1> Hello from CodeVance</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1> About CodeVance</h1>");
});

module.exports = app;
