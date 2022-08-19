const express = require("express");
const Url = require("../models/Url");
const {
  isValidWebUrl,
  generateShortUrl,
  getExpirationDate,
  idetifyUser,
  generateHash,
} = require("../helpers");

const router = express.Router();

router.post("/shorten", async (req, res) => {
  const userId = idetifyUser(req);
  const { longUrl, expiresAfter } = req.body;
  const expiresAt = getExpirationDate(expiresAfter);

  if (isValidWebUrl(longUrl)) {
    return res.status(400).json("Invalid URL");
  }

  if (!expiresAt) {
    return res.status(400).json("Invalid expiration time");
  }

  try {
    const urlHash = generateHash(`${userId}${expiresAt.getTime()}${longUrl}`);
    const newUrl = new Url({
      urlHash,
      longUrl,
      expiresAt,
      userId,
    });

    await newUrl.save();

    res.json({ shortUrl: generateShortUrl(newUrl.urlHash), expiresAt });
  } catch (error) {
    console.log(error);

    res.status(500).json("Server error");
  }
});

module.exports = router;
