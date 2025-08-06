require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { rateLimit } = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(morgan("dev"));

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:5001/api/auth",
    changeOrigin: true,
  })
);

app.use((err, req, res, next) => {
  console.error("API Gateway Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong at the API Gateway.",
  });
});

const PORT = process.env.GATEWAY_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
