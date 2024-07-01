const express = require("express");
const verifyGuid = require("../controllers/tokenController");
const verifyToken = require("../middleware/tokenMiddleware");
const router = express.Router();

router.post("/identity", verifyGuid);
router.post("/verify-token", verifyToken);

module.exports = router;
