const { v4: uuidv4 } = require("uuid");
const Token = require("../models/Token");

const generateGuid = async (req, res) => {
  // Retrieve the auth handler app URL from environment variables
  const authHandlerAppUrl = process.env.AUTH_HANDLER_APP_URL;

  // Retrieve the 'next' query parameter and authorization token from the request
  const { next } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  const provider = req.body.provider;

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

module.exports = { generateGuid, verifyGuid };
