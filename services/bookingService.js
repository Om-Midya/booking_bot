const axios = require('axios');


async function getAllRooms() {
    try {
        const response = await axios.get('https://bot9assignement.deno.dev/rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
}

async function getPrice({ roomName }) {
    try {
        const rooms = await getAllRooms();
        const room = rooms.find(room => room.name.toLowerCase() === roomName.toLowerCase());
        if (!room) {
            throw new Error(`Room '${roomName}' not found.`);
        }
        return `The price of ${roomName} (Room ID: ${room.id}) is ${room.price}`;
    } catch (error) {
        console.error('Error fetching room data:', error);
        throw error;
    }
}

async function createBooking({ roomId, fullName, email, nights }) {

    try{
        const bookingData = {
            roomId: roomId,
            fullName: fullName,
            email: email,
            nights: nights
        };

        const response = await axios.post('https://bot9assignement.deno.dev/book', bookingData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseData = response.data;
        console.log('Booking response:', responseData);
        return `Booking successful! Your booking ID is ${responseData.bookingId} and the total price is ${responseData.totalPrice}`;
    }
    catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}


module.exports = { getAllRooms, createBooking, getPrice };
