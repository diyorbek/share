const { Schema, model } = require("mongoose");

const pasteSchema = Schema({
  urlId: { type: String, required: true, unique: true },
  title: { type: String, required: true, maxLength: 100 },
  content: { type: String, required: true },
  language: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isDeleted: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Paste", pasteSchema);
