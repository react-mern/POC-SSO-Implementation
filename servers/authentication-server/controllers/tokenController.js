const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const User = require("../models/User");
const InvalidatedToken = require("../models/InvalidatedToken");
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const generateGuid = async (req, res) => {
  // Retrieve the auth handler app URL from environment variables
  const authHandlerAppUrl = process.env.AUTH_HANDLER_APP_URL;

  // Retrieve the 'next' query parameter and authorization token from the request
  const { next } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  const { provider } = req.body;

  // If no token is provided, redirect to the login page of the auth handler app
  if (!token) {
    return res
      .status(301)
      .redirect(`${authHandlerAppUrl}/auth/login?next=${next}`);
  }

  try {
    // Generate a new UUID
    const uuid = uuidv4();

    // Create a new Token entry with the generated UUID, token, and provider
    const tokenEntry = new Token({ uuid, token, provider });
    await tokenEntry.save();

    // Respond with the generated UUID
    res.status(200).json({ uuid });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyGuid = async (req, res) => {
  // Retrieve the GUID from the request body
  const { guid } = req.body;

  try {
    // Find the Token entry with the provided GUID
    const tokenEntry = await Token.findOne({ uuid: guid });
    if (!tokenEntry) {
      return res.status(404).json({ error: "GUID not found" });
    }

    // Respond with the associated token and provider
    res
      .status(200)
      .json({ token: tokenEntry.token, provider: tokenEntry.provider });
  } catch (error) {
    console.error("Error during GUID verification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateGuid = async (req, res) => {
  // Retrieve the auth handler app URL from environment variables
  const authHandlerAppUrl = process.env.AUTH_HANDLER_APP_URL;

  // Retrieve the 'next' query parameter and authorization token from the request
  const { next } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  const { guid, provider } = req.body;

  // If no token is provided, redirect to the login page of the auth handler app
  if (!token) {
    return res
      .status(301)
      .redirect(`${authHandlerAppUrl}/auth/login?next=${next}`);
  }

  try {
    const oldTokenEntry = await Token.findOne({ uuid: guid });

    // Save the old token entry to the InvalidatedToken model
    if (oldTokenEntry) {
      const invalidatedTokenEntry = new InvalidatedToken({
        uuid: oldTokenEntry.uuid,
        token: oldTokenEntry.token,
        provider: oldTokenEntry.provider,
      });
      await invalidatedTokenEntry.save();
    }

    // Update the Token entry with the provided GUID
    const updatedTokenEntry = await Token.findOneAndUpdate(
      { uuid: guid },
      { token, provider },
      { new: true } // Return the updated document
    );

    // Check if the token entry was found and updated
    if (!updatedTokenEntry) {
      return res.status(404).json({ error: "GUID not found" });
    }

    // Respond with a success message
    return res.status(200).json({
      token: updatedTokenEntry.token,
      provider: updatedTokenEntry.provider,
    });
  } catch (error) {
    console.error("Error updating token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const refreshAccessToken = async (req, res) => {
  // Extract the refresh token from the authorization header
  const refreshToken = req.body.refresh_token;

  if (!refreshToken) {
    return res.status(403).json({ error: "Refresh token is required" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const accessTokenExpiryDuration = 60 * 1; // 1 hour in seconds

    // Find the user by id
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate a new access token
    const access_token = jwt.sign(
      { userId: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: accessTokenExpiryDuration } // Access token expires in 1 hour
    );

    // Respond with the new access token
    res
      .status(200)
      .json({ access_token, expires_in: accessTokenExpiryDuration });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

module.exports = { generateGuid, verifyGuid, updateGuid, refreshAccessToken };
