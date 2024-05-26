import express from "express";
import { middleware } from "../middlewares";
import { userController } from "../controllers";

const api = express.Router();

api.get("/user/me", middleware.asureAuth, userController.getMe);

export const userRoutes = api;
