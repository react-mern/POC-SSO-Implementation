const express = require('express');
const { generateGuid, verifyGuid, updateGuid } = require('../controllers/tokenController');
const verifyToken = require('../middleware/authMiddleware');
const { refreshAccessToken } = require('../controllers/tokenController');
const router = express.Router();

router.post('/identity', verifyToken, generateGuid);
router.post('/update-identity', updateGuid);
router.post('/verify-guid', verifyGuid);
router.post('/refresh-token',refreshAccessToken);
router.post('/verify-token',verifyToken,(req, res) => {
  res.status(200).send('Token is valid');
})

module.exports = router;