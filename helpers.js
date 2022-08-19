const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function isValidWebUrl(url) {
  try {
    const { protocol } = new URL(url);
    return protocol === "http" || protocol === "https";
  } catch (error) {
    return false;
  }
}

function generateShortUrl(urlHash) {
  return `${process.env.BASE_URL}/${urlHash}`;
}

const ONE_MINUTE = 60_000;
const TEN_MINUTES = 10 * ONE_MINUTE;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

function getExpirationDate(expiresAfter) {
  switch (expiresAfter) {
    case "10M":
      return new Date(Date.now() + TEN_MINUTES);
    case "1H":
      return new Date(Date.now() + ONE_HOUR);
    case "1D":
      return new Date(Date.now() + ONE_DAY);
    case "1W":
      return new Date(Date.now() + ONE_WEEK);
    case "1M": {
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    }
    default:
      return null;
  }
}

/**
 * @param {import("express").Request} req
 * @return {string}
 */
function idetifyUser(req) {
  const [, token] = (req.headers.authorization || "").split("Bearer ");

  if (!token) {
    return res.status(401).json("Unauthorized");
  }

  const { userId } = jwt.decode(token);

  return userId;
}

function generateHash(str) {
  return crypto
    .createHash("sha256")
    .update(str)
    .digest("base64url")
    .substring(0, 6);
}

module.exports = {
  isValidWebUrl,
  generateShortUrl,
  getExpirationDate,
  idetifyUser,
  generateHash,
  ONE_DAY,
};
