const express = require("express");
const { nanoid } = require("nanoid");

const Paste = require("../models/Paste");
const { isValidPaste, isValidPasteLanguage } = require("../helpers/validators");
const {
  generateViewShortUrl,
  getExpirationDate,
  idetifyUser,
} = require("../helpers/misc");

const router = express.Router();

router.post("/", async (req, res) => {
  const userId = idetifyUser(req);

  if (!userId || !isValidPaste(req.body)) {
    return res.status(400).json("Invalid request body");
  }

  const { title, content, language, expiresAfter } = req.body;
  const expiresAt = getExpirationDate(expiresAfter);

  if (!expiresAt) {
    return res.status(400).json("Invalid expiration time");
  }

  if (!isValidPasteLanguage(language)) {
    return res.status(400).json("Invalid content language");
  }

  try {
    const urlId = nanoid(8);
    const newPaste = new Paste({
      urlId,
      title: title.trim(),
      content,
      language,
      expiresAt,
      userId,
    });

    await newPaste.save();

    res.json({
      url: generateViewShortUrl(newPaste.urlId),
      title,
      content,
      language,
      expiresAt,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json("Server error");
  }
});

module.exports = router;
