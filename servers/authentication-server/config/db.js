const mongoose = require("mongoose");

/**
 * Function to connect to MongoDB.
 *
 * This function establishes a connection to the MongoDB database using the
 * connection string provided in the environment variable `MONGO_URI`.
 */

const connectToDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string in the environment variable MONGO_URI
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Connection Failed!", error);
    process.exit(1);
  }
};

module.exports = connectToDB;
