const { Schema, model } = require("mongoose");

const userSchema = Schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  passwordHash: String,
});

module.exports = model("User", userSchema);
