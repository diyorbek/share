const jwt = require("jsonwebtoken");

const TOKEN_KEY = process.env.TOKEN_KEY || "super-secret-token-key";
const AUTH_COOKIE_NAME = "access_token";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function authorize(req, res, next) {
  const token = req.signedCookies[AUTH_COOKIE_NAME] || "";

  if (!token) {
    return res.status(401).json("Unauthorized");
  }

  try {
    jwt.verify(token, TOKEN_KEY);
    next();
  } catch (error) {
    res.status(401).json("Unauthorized");
  }
}

module.exports = authorize;
module.exports.AUTH_COOKIE_NAME = AUTH_COOKIE_NAME;
module.exports.TOKEN_KEY = TOKEN_KEY;
