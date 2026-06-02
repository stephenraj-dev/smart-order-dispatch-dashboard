import { io } from "socket.io-client";

export const socket = io(
  "https://order-dispatch-dashboard.onrender.com"
);