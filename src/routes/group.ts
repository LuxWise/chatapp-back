import express from "express";
import multer from "multer";
import { middleware } from "../middlewares";
import { groupController } from "../controllers";

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

api.get("/group", middleware.asureAuth, groupController.getAll);
api.get("/group/:id", middleware.asureAuth, groupController.getGroup);
api.post(
  "/group",
  middleware.asureAuth,
  upload.single("image"),
  groupController.create
);
api.patch(
  "/group/add_participants/:id",
  middleware.asureAuth,
  groupController.addParticipants
);
api.patch("/group/ban", middleware.asureAuth, groupController.banParticipant);
api.patch(
  "/group/:id",
  middleware.asureAuth,
  upload.single("image"),
  groupController.updateGroup
);
api.patch("/group/exit/:id", middleware.asureAuth, groupController.exitGroup);

export const groupRoutes = api;
