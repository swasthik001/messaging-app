const express = require('express'); // The waiter
const http = require('http');       // For making a server
const { Server } = require('socket.io'); // The phone line
const dotenv = require('dotenv');   // To hide secret keys

dotenv.config(); // Load hidden keys from a .env file

const app = express();             // Start the waiter
const server = http.createServer(app); // Start the oven
const io = new Server(server, { cors: { origin: '*' } }); // Start the phone line

// Log to confirm server setup
console.log('Socket.IO server is set up');

// Allow app to understand JSON (data in text form)
app.use(express.json());

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a chat room
    socket.on('joinRoom', ({ room }) => {
        socket.join(room); // User enters the room
        console.log(`User joined room: ${room}`);
    });

    // Listen for messages and send to everyone in the room
    socket.on('message', (message) => {
        io.to(message.room).emit('message', message); // Send to all in room
    });

    // When the user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000; // Port is like your address
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
