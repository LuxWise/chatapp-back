import express from "express";
import { authController } from "../controllers";

const api = express.Router();

api.post("/register", authController.register);
api.post("/login", authController.login);
api.post("/refresh_acces_token", authController.refreshAccesToken);

export const authRoutes = api;
