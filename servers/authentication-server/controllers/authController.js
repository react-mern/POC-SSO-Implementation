const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");
const InvalidatedToken = require("../models/InvalidatedToken");

/**
 * Registers a new user.
 *
 * This function handles the registration of a new user by:
 * 1. Checking if the email is already in use.
 * 2. Hashing the user's password.
 * 3. Saving the new user's details to the database.
 *
 * @param {Object} req - The request object containing user details (name, email, password).
 * @param {Object} res - The response object used to send back the appropriate response.
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Registration error: ", error);
    res.status(500).json({ error: "Registration failed!" });
  }
};

/**
 * Logs in a user.
 *
 * This function handles user login by:
 * 1. Verifying the user's email and password.
 * 2. Generating a JWT token for the user.
 *
 * @param {Object} req - The request object containing user credentials (email, password).
 * @param {Object} res - The response object used to send back the appropriate response.
 */

const login = async (req, res) => {
  try {
    const { email, password } = req.body.credentials;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token for the user
    const token = generateToken(user);

    // Respond with the token and user details
    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed!" });
  }
};

/**
 * Logs out a user.
 *
 * This function handles user logout by:
 * 1. Invalidating the JWT token.
 *
 * @param {Object} req - The request object containing the JWT token in the authorization header.
 * @param {Object} res - The response object used to send back the appropriate response.
 */

const logout = async (req, res) => {
  // Extract the token from the authorization header
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    // Invalidate the token by storing it in the InvalidatedToken collection
    await InvalidatedToken.findOneAndUpdate(
      { token },
      { token },
      { upsert: true, new: true }
    );
  }

  // Respond with a success status
  res.sendStatus(200);
};

module.exports = { register, login, logout };
