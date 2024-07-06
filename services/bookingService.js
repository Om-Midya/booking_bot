const axios = require('axios');
const { Booking } = require('../models');

async function getAllRooms() {
    try {
        const response = await axios.get('https://bot9assignement.deno.dev/rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
}

async function createBooking({ roomId, fullName, email, nights }) {
    const bookingData = {
        roomId: roomId,
        fullName: fullName,
        email: email,
        nights: nights
    };

    try {
        const response = await axios.post('https://bot9assignement.deno.dev/book', bookingData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const booking = await Booking.create(bookingData);
        return booking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

async function getPrice({ roomName }) {
    const url = 'https://bot9assignement.deno.dev/rooms';

    try {
        const response = await axios.get(url);
        const rooms = response.data;

        const room = rooms.find(room => room.name.toLowerCase() === roomName.toLowerCase());

        if (room) {
            return room.price;
        } else {
            throw new Error(`Room '${roomName}' not found.`);
        }
    } catch (error) {
        console.error('Error fetching room data:', error);
        throw error;
    }
}

module.exports = { getAllRooms, createBooking, getPrice };
