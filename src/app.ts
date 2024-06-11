import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { initSocketServer } from "./utils";
import { IP_SERVER, PORT } from "./constants";
import {
  authRoutes,
  chatMessageRoutes,
  chatRouter,
  groupMessageRoutes,
  groupRoutes,
  userRoutes,
} from "./routes";

const corsOptions = {
  origin: [`http://${IP_SERVER}:${PORT}`],
  methods: ["POST", "GET", "PUT"],
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const server = http.createServer(app);
initSocketServer(server);

app.use(express.json());
app.use(express.static("uploads"));
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", chatRouter);
app.use("/", chatMessageRoutes);
app.use("/", groupRoutes);
app.use("/", groupMessageRoutes);

export { server };
