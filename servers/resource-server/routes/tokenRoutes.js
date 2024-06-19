const express = require("express");
const verifyGuid = require("../controllers/tokenController");
const router = express.Router();

router.post("/identity", verifyGuid);

module.exports = router;
