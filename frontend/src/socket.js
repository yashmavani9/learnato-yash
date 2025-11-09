import { io } from "socket.io-client";

export const socket = io("https://learnato-yash.onrender.com", {
  transports: ["websocket"],
});
