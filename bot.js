const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

let chatId = 0;
let messages = []
bot.start((ctx) =>{
    chatId = ctx.message.chat.id;
    ctx.reply('Welcome! How can I assist you today?')

});
bot.help((ctx) => ctx.reply('You can ask me about available rooms, prices, or create a booking.'));

bot.on('text', async (ctx) => {
    if(!chatId){
        chatId = ctx.message.chat.id;
    }
    const userMessage = ctx.message.text;
    await ctx.telegram.sendChatAction(chatId,'typing');
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
