const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { AUTH_COOKIE_NAME } = require("../middlewares/authorize");

function isValidWebUrl(url) {
  try {
    const { protocol } = new URL(url);
    return protocol === "http" || protocol === "https";
  } catch (error) {
    return false;
  }
}

function generateViewShortUrl(urlHash) {
  return `${process.env.BASE_URL}/api/paste/${urlHash}`;
}

const ONE_MINUTE = 60_000;
const TEN_MINUTES = 10 * ONE_MINUTE;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

function getExpirationDate(expiresAfter) {
  switch (expiresAfter) {
    case "1m":
      return new Date(Date.now() + ONE_MINUTE);
    case "10m":
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
    case "6M": {
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() + 6);
      return newDate;
    }
    case "1Y": {
      const newDate = new Date();
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    }
    default:
      return null;
  }
}

/**
 * @param {import("express").Request} req
 * @return {string | undefined}
 */
function identifyUser(req) {
  const token = req.signedCookies[AUTH_COOKIE_NAME] || "";
  const decoded = jwt.decode(token);

  return decoded ? decoded.userId : undefined;
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
  generateViewShortUrl,
  getExpirationDate,
  idetifyUser: identifyUser,
  generateHash,
  ONE_DAY,
};
