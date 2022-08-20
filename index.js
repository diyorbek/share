require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./db");
const authorize = require("./middlewares/authorize");
const app = express();

connectDB();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", require("./routes/auth"));
app.use("/api/paste", authorize, require("./routes/paste"));

app.listen(process.env.SERVER_PORT || 5500, () =>
  console.log(`Server started at ${process.env.SERVER_PORT}`)
);
