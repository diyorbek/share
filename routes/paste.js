const express = require("express");
const { nanoid } = require("nanoid");

const Paste = require("../models/Paste");
const { isValidPaste, isValidPasteLanguage } = require("../helpers/validators");
const {
  generateViewShortUrl,
  getExpirationDate,
  idetifyUser,
} = require("../helpers/misc");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.get("/", authorize, async (req, res) => {
  try {
    const userId = idetifyUser(req);
    const pastes = (await Paste.find({ userId })).map((paste) => ({
      url: generateViewShortUrl(paste.urlId),
      title: paste.title,
      content: paste.content,
      language: paste.language,
      expiresAt: paste.expiresAt,
    }));

    return res.json(pastes);
  } catch (error) {
    console.log(error);

    return res.status(500).json("Server error");
  }
});

router.get("/:urlId", async (req, res) => {
  try {
    const { urlId } = req.params;
    const paste = await Paste.findOne({
      $and: [{ urlId }, { expiresAt: { $gt: new Date() } }],
    });

    if (!paste) return res.status(404).json("Not found");

    return res.json({
      title: paste.title,
      content: paste.content,
      language: paste.language,
      expiresAt: paste.expiresAt,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json("Server error");
  }
});

router.post("/", authorize, async (req, res) => {
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
      title: newPaste.title,
      content: newPaste.content,
      language: newPaste.language,
      expiresAt: newPaste.expiresAt,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json("Server error");
  }
});

module.exports = router;
