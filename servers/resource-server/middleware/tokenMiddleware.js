/**
 * Verifies the authenticity of the token by sending it to the authentication server.
 * If the token is valid, returns a success message.
 * If the token is invalid or has expired, removes it from the cookies and returns an error message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

const verifyToken = async (req, res) => {
  // Extract the token from req headers and provider from req body
  const token = req.headers.authorization?.split(" ")[1];
  const provider = req.body.provider;

  // Check if token exists
  if (!token) {
    return res.status(401).send("Token is missing");
  }

  try {
    // Send token to the authentication server for verification
    const response = await fetch(
      "http://localhost:8000/api/token/verify-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ provider }),
      }
    );

    // Check if response indicates successful verification
    if (!response.ok) {
      // If token is invalid or has expired, remove it from the cookies and redirect to home page
      res.clearCookie("auth");
      return res.status(401).send("Invalid or expired token");
    }

    // If token is valid, return a success message
    return res.status(200).json({ message: "Token Verified Successfully!" });
  } catch (error) {
    console.error("Error during token verification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = verifyToken;
