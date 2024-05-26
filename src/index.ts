import mongoose from "mongoose";
import { server } from "./app";
import { PORT, IP_SERVER, DB_USER, DB_HOST, DB_PASSWORD } from "./constants";
import { io } from "./utils";

const mongooseUrl: string = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}`;

async function startServer() {
  try {
    await mongoose.connect(mongooseUrl);
    console.log("Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(`API REST RUN http://${IP_SERVER}:${PORT}`);

      io?.sockets.on("connection", socket => {
        console.log("NEW USER CONNECT");

        socket.on("join", room => {
          socket.join(room);
          console.log("USER JOIN");
        });

        socket.on("leave", room => {
          socket.leave(room);
          console.log("USER LEFT");
        });

        socket.on("DISCONNECT", () => {
          console.log("USER DISCONNECT");
        });
      });
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
}

startServer();
