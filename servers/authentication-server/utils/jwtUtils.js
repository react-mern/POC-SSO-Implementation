const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const generateTokenPair = (user) => {
  const accessTokenExpiryDuration = 60 * 1; // 1 hour in seconds
  const refreshTokenExpiryDuration = 7 * 24 * 60 * 60; // 7 days in seconds

  const access_token = jwt.sign(
    { userId: user._id, email: user.email },
    SECRET_KEY,
    { expiresIn: accessTokenExpiryDuration } // Access token expires in 1 hour
  );

  const refresh_token = jwt.sign(
    { userId: user._id, email: user.email },
    REFRESH_SECRET_KEY,
    { expiresIn: refreshTokenExpiryDuration } // Refresh token expires in 7 days
  );

  return { access_token, refresh_token, expires_in: accessTokenExpiryDuration };
};

module.exports = { generateTokenPair };
