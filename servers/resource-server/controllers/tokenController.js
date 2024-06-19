/**
 * Verifies the GUID by making a request to the authentication server.
 * If the GUID exists, returns the token and provider associated with it.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

const verifyGuid = async (req, res) => {
  // Import the Auth handler app's server url
  const authHandlerAppServerUrl = process.env.AUTH_HANDLER_APP_SERVER_URL;

  // Extract the guid from the req body
  const { guid } = req.body;
  let token, provider;

  if (guid) {
    try {
      // Make a request to the authentication server to check if the guid exists
      const response = await fetch(
        `${authHandlerAppServerUrl}/api/token/verify-guid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guid }),
        }
      );

      // If guid verification is successful, authentication server returns token & provider as a response
      const tokenData = await response.json();
      if (tokenData) {
        // If the token is valid, return the token and provider to the frontend
        token = tokenData.token;
        provider = tokenData.provider;
        return res.status(200).json({ token, provider });
      }
    } catch (error) {
      console.error("Error during GUID verification:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = verifyGuid;
