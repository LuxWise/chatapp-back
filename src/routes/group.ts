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

api.get("/group", middleware.asureAuth, groupController.create);
api.get("/group/:id", middleware.asureAuth, groupController.create);
api.post(
  "/group",
  middleware.asureAuth,
  upload.single("image"),
  groupController.create
);
api.patch("/group/exit/:id", middleware.asureAuth, groupController.create);
api.patch(
  "/group/add_participants/:id",
  middleware.asureAuth,
  groupController.create
);
api.patch("/group/ban", middleware.asureAuth, groupController.create);
api.patch("/group/:id", middleware.asureAuth, groupController.create);

export const groupRoutes = api;
