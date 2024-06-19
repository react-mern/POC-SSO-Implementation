const jwt = require("jsonwebtoken");
const InvalidatedToken = require("../models/InvalidatedToken");
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware function to verify the authenticity of a token.
 * Checks if the token is provided, not invalidated, and properly signed.
 * Verifies the token based on the provider (Google, GitHub, or custom JWT).
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next function in the middleware chain
 * @returns {Object} - Returns a status and message if verification fails
 */
const verifyToken = async (req, res, next) => {
  // Extract token and provider from request headers and body
  const token = req.headers.authorization?.split(" ")[1];
  const provider = req.body.provider;

  // Check if token is missing
  if (!token) {
    return res.status(401).send("Token is missing");
  }

  // Check if token is invalidated
  const invalidatedToken = await InvalidatedToken.findOne({ token });
  if (invalidatedToken) {
    return res.status(401).send("Invalid Token");
  }

  // Verify token based on the provider
  switch (provider) {
    case "google":
      try {
        await verifyGoogleToken(token);
        next();
      } catch (error) {
        return res.status(401).send("Unauthorized Access!");
      }
      break;
    case "github":
      try {
        await verifyGithubToken(token);
        next();
      } catch (error) {
        return res.status(401).send("Unauthorized Access!");
      }
      break;
    default:
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).send("Failed to authenticate token");
        }
        req.user = decoded;
        next();
      });
      break;
  }
};

/**
 * Function to verify Google access token.
 *
 * @param {string} token - Google access token
 */
const verifyGoogleToken = async (token) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
  );
  if (!response.ok) {
    throw new Error("Unauthorized Access!");
  }
};

/**
 * Function to verify GitHub access token.
 *
 * @param {string} token - GitHub access token
 */
const verifyGithubToken = async (token) => {
  const response = await fetch(`https://api.github.com/octocat`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Unauthorized Access!");
  }
};

module.exports = verifyToken;
