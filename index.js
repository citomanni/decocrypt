const dotenv = require("dotenv");
// Load environment variables before requiring modules that read process.env at import time.
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const newsRoutes = require("./routes/newsRoutes");

const app = express();

const PORT = process.env.PORT || 8000;
const ADMIN_PATH = process.env.ADMIN_PATH || "/admin-panel";

mongoose
  .connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    dbname: process.env.DB_NAME,
  })
  .then(() => console.log("Successfully connected to the database"))
  .catch((err) =>
    console.error(`Error connecting to the database: ${err.message}`)
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Expose the admin base path and LINE chat URL to all views.
app.use((req, res, next) => {
  res.locals.adminPath = ADMIN_PATH;
  res.locals.lineUrl = process.env.LINE_URL || "";
  next();
});

app.use(ADMIN_PATH, adminRouter);
app.use("/api", newsRoutes);
app.use("/", userRouter);

// 404 - no route matched
app.use((req, res, next) => {
  res.status(404).render("error-404");
});

// Global error handler - catches everything forwarded via catchAsync/next(err)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.stack || err.message);

  if (statusCode === 403) {
    return res.status(403).render("error-403");
  }
  res.status(statusCode).render("error-500");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
