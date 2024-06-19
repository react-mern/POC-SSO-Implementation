const express = require("express");
const cors = require("cors");
const tokenRoutes = require("./routes/tokenRoutes");
const openRoutes = require("./config/openRoutes");
const verifyToken = require("./middleware/tokenMiddleware");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  if (openRoutes.includes(req.path)) {
    return next();
  } else {
    return verifyToken(req, res, next);
  }
});

// Routes
app.use("/api", tokenRoutes);

module.exports = app;
