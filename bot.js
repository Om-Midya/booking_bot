const { Telegraf } = require('telegraf');
require('dotenv').config();
const { processMessage } = require('./utils/openaiHelper');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

let chatId = 0;
let messages = []
bot.start((ctx) =>{
    chatId = ctx.message.chat.id;
    ctx.reply('Welcome! How can I assist you today?')
     messages = [
        { role: 'system', content: "You are a bot that helps travelers to book a room at the Bot9 Palace. Extract checkin data user name, email number of nights for stay and name of room to stay in from the user. Respond to queries relate to booking room at the Bot9 Palace only. Do not handle queries about other hotels or general queries, say that you can only help with booking rooms at the Bot9 Palace. When a user choose a room ask them to confirm booking with their name and email and the room name, automatically add room id and number of nights according to the user's check-in date. If the user doesn't provide a check-in date, ask them to provide it. If the user doesn't provide a name or email or other details, ask them to provide it before confirming. If the user doesn't confirm the booking, ask them if they would like to book another room. If the user confirms the booking, generate a booking confirmation, thank them and say goodbye." }
    ];

});
bot.help((ctx) => ctx.reply('You can ask me about available rooms, prices, or create a booking.'));

bot.on('text', async (ctx) => {
    if(!chatId){
        chatId = ctx.message.chat.id;
    }
    const userMessage = ctx.message.text;
    try{
        const response = await fetch('http://localhost:3002/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: userMessage, chatId})
        });
        const responseData = await response.json();
        ctx.reply(responseData.message);
    }catch (error){
        console.error('Error sending message to server:', error);
        ctx.reply('Internal Server Error. Please try again later.');
    }
});
bot.launch();

console.log('Telegram bot is running...');
