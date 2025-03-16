const socket = io('http://localhost:3000'); // Ensure this matches the backend URL

// Confirm connection
socket.on('connect', () => {
    console.log('✅ Connected to server');
});

// Send message when the button is clicked
document.getElementById('sendMessage').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value;

    if (!userInput.trim()) {
        alert("Please enter a message!");
        return;
    }

    // Send message to server
    socket.emit('message', userInput);
    document.getElementById('userInput').value = ''; // Clear input
});

// Receive messages from the server
socket.on('message', (data) => {
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<p><strong>Client:</strong> ${data.user}</p>`;
    chatbox.innerHTML += `<p><strong>Server:</strong> ${data.server}</p>`;
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the latest message
});

// Load chat history when connecting
socket.on('chatHistory', (history) => {
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML = '';  // Clear chatbox
    history.forEach((msg) => {
        chatbox.innerHTML += `<p><strong>Client:</strong> ${msg.user}</p>`;
        chatbox.innerHTML += `<p><strong>Server:</strong> ${msg.server}</p>`;
    });
});
