require("dotenv").config();
const express = require("express");

const connectDB = require("./db");
const app = express();

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.listen(process.env.SERVER_PORT || 5500, () =>
  console.log(`Server started at ${process.env.SERVER_PORT}`)
);
