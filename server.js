const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3000;

// Create an HTTP server
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }  // Allow all clients
});

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

let conversation = []; // Store chat messages

io.on('connection', (socket) => {
    console.log('A user connected'); // This should appear when a user connects

    // Send chat history to newly connected client
    socket.emit('chatHistory', conversation);

    socket.on('message', (message) => {
        console.log(`Client: ${message}`);

        // Generate a response
        let reply;
        if (message.toLowerCase().includes("hello")) {
            reply = "Hello! How can I help you?";
        } else if (message.toLowerCase().includes("how are you")) {
            reply = "I'm a server, I run 24/7! How about you?";
        } else if (message.toLowerCase().includes("bye")) {
            reply = "Goodbye! Hope to chat again.";
        } else {
            reply = `You said: "${message}". I'm still learning!`;
        }

        // Store messages
        const chatMessage = { user: message, server: reply };
        conversation.push(chatMessage);

        // Broadcast to all clients
        io.emit('message', chatMessage);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected'); // Should appear when a user disconnects
    });
});

// Start the server
server.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
