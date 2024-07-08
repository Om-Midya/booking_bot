const OpenAI = require('openai');
require('dotenv').config();
const { getAllRooms, getPrice, createBooking } = require('../services/bookingService');

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey,
});

let allMessages = [{role: 'system', content: "You are a bot that helps travelers to book a room at the Bot9 Palace. Extract checkin data user name, email number of nights for stay and name of room to stay in from the user. Respond to queries relate to booking room at the Bot9 Palace only. Do not handle queries about other hotels or general queries, say that you can only help with booking rooms at the Bot9 Palace. When a user choose a room ask them to confirm booking with their name and email and the room name, automatically add room id and number of nights according to the user's check-in date. If the user doesn't provide a check-in date, ask them to provide it. If the user doesn't provide a name or email or other details, ask them to provide it before confirming. If the user doesn't confirm the booking, ask them if they would like to book another room. If the user confirms the booking, generate a booking confirmation, thank them and say goodbye." }]

async function sendMessage(prompt, messages) {

    if (messages || messages.length > 0) {
        allMessages.push(...messages)
    }

    allMessages.push({ role: 'user', content: prompt })
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: allMessages,
            tools: tools,
        });

        const responseMessage = response.choices[0].message;
        const toolCalls = responseMessage.tool_calls;

        if (toolCalls) {
            const availableFunctions = {
                "getPrice": getPrice,
                "getAllRooms": getAllRooms,
                "createBooking": createBooking
            };
            allMessages.push(responseMessage);

            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionToCall = availableFunctions[functionName];
                const functionArgs = JSON.parse(toolCall.function.arguments);
                const functionResponse = await functionToCall(functionArgs);

                // Construct and push the response message for the tool call
                allMessages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: JSON.stringify(functionResponse),
                });

                if(functionResponse.missingParams){
                    for(const prompt of functionResponse.missingParams){
                        allMessages.push({role: 'user', content: prompt})
                    }

                    return await sendMessage({prompt:'', messages})
                }
            }

            const secondResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: allMessages,
            });
            console.log(allMessages)
            return secondResponse.choices[0].message.content;
        }

        return responseMessage.content;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw new Error('An error occurred while processing the request.');
    }
}

const tools = [
    {
        "name": "getAllRooms",
        "description": "Get the available room options. This function returns a list of rooms that are available to book. You can get all the information of the rooms from this function.",
        "type": "function",
        "function": {
            "name": "getAllRooms",
            "parameters": {}
        }
    },
    {
        "name": "getPrice",
        "description": "Get the price of a specific room. This function returns the price of the room by name.",
        "type": "function",
        "function": {
            "name": "getPrice",
            "parameters": {
                "type": "object",
                "properties": {
                    "roomName": {
                        "type": "string",
                        "description": "the name of the specific room"
                    }
                },
                "required": ["roomName"]
            }
        }
    },
    {
        "name": "createBooking",
        "description": "Book a room for a guest. This function books a room for a guest. You need to provide the room ID, guest's full name, email, and the number of nights to book the room for. The function returns the booking confirmation details. The parameters must be JSON encoded.",
        "type": "function",
        "function": {
            "name": "createBooking",
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
    }
];

const processMessage = async (userMessage,messages) => {
    try {
        const response = await sendMessage(userMessage,messages);
        console.log("Received: " + response);

        return response;
    } catch (error) {
        console.error('Error processing message:', error);
        return 'An error occurred while processing your request. Please try again later.';
    }
};

module.exports = { processMessage };
