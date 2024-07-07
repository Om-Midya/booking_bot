# Bot9 Palace Booking Bot

## Overview
The Bot9 Palace Booking Bot is a Telegram bot designed to assist users in booking rooms at the Bot9 Palace. Users can interact with the bot to view available rooms and book them by providing necessary details. Upon successful booking, the bot generates a booking ID and confirms the room reservation.

## Features
- **View Available Rooms**: Users can inquire about available rooms and their prices.
- **Book Rooms**: Users can book rooms by providing their full name, email, number of nights for the stay, and the room name.
- **Booking Confirmation**: The bot generates a booking ID and confirms the reservation with the user.

## Setup Instructions

### Prerequisites
- Node.js installed on your system.
- A Telegram account.

### Step 1: Clone the Repository
Clone the project repository to your local machine using the following command:
```bash
git clone <repository-url>
```

### Step 2: Install Dependencies
Navigate to the project directory and install the required dependencies using the following command:
```bash
npm install
```

### Step 3: Create a Telegram Bot
- Open the Telegram app and search for the BotFather.
- Create a new bot by following the instructions provided by the BotFather.
- Copy the bot token generated by the BotFather.
- Set the bot privacy to `Disable` to allow the bot to read all messages sent to it.
- Copy the bot token and save it for later use.


### Step 4: Obtain OpenAI API Key
- Visit the OpenAI website and sign up or log in.
- Navigate to the API section and generate a new API key.

### Step 5: Configure Environment Variables
Create a `.env` file in the project directory and add the following environment variables:
```env
TELEGRAM_BOT_TOKEN=<your_telegram_bot_token>
OPENAI_API_KEY=<your_openai_api_key>
```
### Step 6: Start the Bot and the Server
Run the following command to start the bot:
```bash
node bot.js
```
Run the following command to start the server:
```bash
node server.js
```

### Usage
After starting the bot, you can interact with it through Telegram by sending messages. Use the /start command to begin a conversation with the bot and follow the prompts to view available rooms or book a room. 