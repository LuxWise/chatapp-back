import express from "express";
import multer from "multer";
import { middleware } from "../middlewares";
import { chatMessageController } from "../controllers";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "src/uploads/images");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now().toString() + file.originalname);
  },
});

const upload = multer({ storage });

const api = express.Router();

api.post("/chat/message", middleware.asureAuth, chatMessageController.sendText);
api.post(
  "/chat/message/image",
  middleware.asureAuth,
  upload.single("image"),
  chatMessageController.sendImage
);
api.get(
  "/chat/message/:id",
  middleware.asureAuth,
  chatMessageController.getAll
);
api.get(
  "/chat/message/total/:id",
  middleware.asureAuth,
  chatMessageController.getTotalMessage
);
api.get(
  "/chat/message/last/:id",
  middleware.asureAuth,
  chatMessageController.getLastMessage
);

export const chatMessageRoutes = api;
