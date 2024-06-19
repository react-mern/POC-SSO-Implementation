const express = require('express');
const { generateGuid, verifyGuid } = require('../controllers/tokenController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/identity', verifyToken, generateGuid);
router.post('/verify-guid', verifyGuid);
router.post('/verify-token',verifyToken,(req, res) => {
  res.status(200).send('Token is valid');
})

module.exports = router;