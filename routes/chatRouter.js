const express = require('express');
const { processMessage } = require('../utils/openaiHelper');
const {handleChatMessage, getHistory} = require('../controllers/chatController');

const chatRouter = express.Router();

chatRouter.post('/', handleChatMessage)
chatRouter.get('/:id', getHistory)

module.exports = chatRouter;
