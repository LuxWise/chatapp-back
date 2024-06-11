import express from "express";
import multer from "multer";
import { middleware } from "../middlewares";
import { groupMessageController } from "../controllers/groupMessage";

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

api.post(
  "/group/message",
  middleware.asureAuth,
  groupMessageController.sendText
);
api.post(
  "/group/message/image",
  middleware.asureAuth,
  upload.single("image"),
  groupMessageController.sendImage
);
api.get(
  "/group/message/:group_id",
  middleware.asureAuth,
  groupMessageController.getAll
);
api.get(
  "/group/message/total/:group_id",
  middleware.asureAuth,
  groupMessageController.getTotalMessage
);
api.get(
  "/group/message/last/:group_id",
  middleware.asureAuth,
  groupMessageController.getLastMessage
);

export const groupMessageRoutes = api;
