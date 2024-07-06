const axios = require('axios');
require('dotenv').config();
const { getAllRooms, getPrice, createBooking } = require('../services/bookingService');

const apiKey = process.env.OPENAI_API_KEY;

async function sendMessage(prompt) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        model: 'gpt-4',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
        ],
        functions: functionDescriptions,
        function_call: "auto"
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const functionMap = {
            "getPrice": getPrice,
            "getAllRooms": getAllRooms,
            "createBooking": createBooking
        };

        const output = response.data.choices[0].message.function_call;
        const functionName = output.name;
        const argumentsObject = JSON.parse(output.arguments);

        const functionResponse = await functionMap[functionName](argumentsObject);
        return functionResponse;

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

const functionDescriptions = [
    {
        "name": "getAllRooms",
        "description": "Get the list of all available rooms",
    },
    {
        "name": "getPrice",
        "description": "Get the price of a specific room which the user has given",
        "parameters": {
            "type": "object",
            "properties": {
                "roomName": {
                    "type": "string",
                    "description": "The name of the specific room"
                }
            },
            "required": ["roomName"]
        }
    },
    {
        "name": "createBooking",
        "description": "Creates a booking of the room after user has given all the parameters",
        "parameters": {
            "type": "object",
            "properties": {
                "roomId": {
                    "type": "integer",
                    "description": "Id of the room which user wants to book"
                },
                "fullName": {
                    "type": "string",
                    "description": "Name of the user"
                },
                "email": {
                    "type": "string",
                    "description": "Email of the user"
                },
                "nights": {
                    "type": "integer",
                    "description": "Number of nights the user wants to book the room for"
                }
            },
            "required": ["roomId", "fullName", "email", "nights"]
        }
    }
];

const processMessage = async (message) => {
    try {
        const response = await sendMessage(message);
        console.log("Received: " + response);

        // Format the response if it's an array of objects
        if (Array.isArray(response)) {
            return response.map(room => `Room Name: ${room.name}, Price: ${room.price}`).join('\n');
        }

        return response;
    } catch (error) {
        console.error('Error processing message:', error);
        return null;
    }
};

module.exports = { processMessage };
