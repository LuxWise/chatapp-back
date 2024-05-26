import { Server as SocketServer } from "socket.io";
import http from "http";

export let io: SocketServer | null = null;

export function initSocketServer(server: http.Server) {
  if (io) {
    throw new Error("Socket.IO ya fue inicializada");
  }
  io = new SocketServer(server, {
    cors: {
      origin: "*",
    },
  });

  return io;
}
