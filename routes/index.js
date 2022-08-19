const express = require("express");
const Url = require("../models/Url");

const router = express.Router();

router.get("/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const url = await Url.findOne({
      $and: [{ urlHash: hash }, { expiresAt: { $gt: new Date() } }],
    });

    if (!url) return res.status(404).json("Not found");

    return res.redirect(url.longUrl);
  } catch (error) {
    console.log(error);

    return res.status(500).json("Server error");
  }
});

module.exports = router;
