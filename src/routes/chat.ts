import express from "express";
import { middleware } from "../middlewares";
import { ChatController } from "../controllers";

const api = express.Router();

api.get("/chat", middleware.asureAuth, ChatController.getAll);
api.get("/chat/:id", middleware.asureAuth, ChatController.getChat);
api.post("/chat", middleware.asureAuth, ChatController.create);
api.delete("/chat/:id", middleware.asureAuth, ChatController.deleteChat);

export const chatRouter = api;
