import express from "express";
import multer from "multer";
import { middleware } from "../middlewares";
import { userController } from "../controllers";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "src/uploads/avatar");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now().toString() + file.originalname);
  },
});

const upload = multer({ storage });

const api = express.Router();

api.get("/user/me", middleware.asureAuth, userController.getMe);
api.get("/user", middleware.asureAuth, userController.getUsers);
api.get("/user/:id", middleware.asureAuth, userController.getUser);
api.patch(
  "/user/me",
  middleware.asureAuth,
  upload.single("avatar"),
  userController.updateUser
);

export const userRoutes = api;
