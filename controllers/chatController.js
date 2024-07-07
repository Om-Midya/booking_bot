const {Conversation} = require('../models');
const {processMessage} = require('../utils/openaiHelper');
// const {chatId} = require('../bot');

const getHistory = async (req, res) => {
    const userId = req.params.userId;
    try {
        const conversationHistory = await Conversation.findAll({
            where: {
                userId
            }
        });
        let conversationData=[];
        conversationHistory.forEach((conversation)=>{
            conversationData.push({
                role: "user",
                content: conversation.userMessage
            });
            conversationData.push({
                role: "bot",
                content: conversation.botResponse
            });
        });
        res.status(200).json(conversationData);
    } catch (error) {
        console.error('Error fetching conversation history:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}


const handleChatMessage = async (req, res) => {
    console.log(req.body)
    const userMessage = req.body.message;
    const chatId = req.body.chatId;
    const conversationHistory = await Conversation.findAll({
        where: {
            userId: chatId
        }
    });
    let conversationData = [];
    try{
        conversationHistory.forEach(conv => {
            conversationData.push({role: "user", content: conv.userMessage});
            conversationData.push({role: "assistant", content: conv.botResponse});
        });
        const botResponse = await processMessage(userMessage, conversationData);
        await Conversation.create({ userId:chatId, userMessage, botResponse, });

        res.status(200).json({message: botResponse});
    }catch (error){
        console.error('Error fetching conversation history:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports = { getHistory, handleChatMessage };
