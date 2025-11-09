// src/index.js
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";

dotenv.config();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://learnato-yash.vercel.app/"   // <-- YOURS HERE
    ],
    methods: ["GET", "POST"]
  },
});


// When a new client connects
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

// Export io globally (optional)
app.set("io", io);

// Start server
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
