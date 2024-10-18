// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static("public"));

// Keep track of connected users
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Add user to connected users
  connectedUsers.set(socket.id, {
    id: socket.id,
    name: `User-${socket.id.substr(0, 4)}`,
  });

  // Broadcast updated user list
  io.emit("users-update", Array.from(connectedUsers.values()));

  // Handle signaling for WebRTC
  socket.on("signal", ({ to, from, signal }) => {
    io.to(to).emit("signal", { from, signal });
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);
    io.emit("users-update", Array.from(connectedUsers.values()));
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
