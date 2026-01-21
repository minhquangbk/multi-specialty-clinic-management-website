const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/tinnhanController');

router.get('/api/getallmessages', messagesController.getAllMessages);
router.post('/api/createmessages', messagesController.createMessages);

module.exports = router;