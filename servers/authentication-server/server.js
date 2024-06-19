require("dotenv").config();
const connectToDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 8000;

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
