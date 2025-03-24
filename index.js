const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

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
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/4837jshjfh94y89q293fdkjhf-a73a4d5e2", adminRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
  res.render("error-404");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
