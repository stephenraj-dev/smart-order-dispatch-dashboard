import { Server } from "socket.io";

let io: Server;

export const initSocket = (
  socketServer: Server
) => {
  io = socketServer;
};

export const getIO = () => {
  return io;
};