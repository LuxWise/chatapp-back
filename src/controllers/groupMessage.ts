import { GroupMessage } from "../models";
import { Response } from "express";
import { modifyRequest } from "../types";
import { getFilePath, io } from "../utils";

const sendText = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();
    const { groupId, message } = req.body;
    const { id } = req.userData;

    if (!groupId || !message) throw new Error("infomation is undefined");

    const groupMessage = new GroupMessage({
      group: groupId,
      user: id,
      message: message,
      type: "TEXT",
    });

    try {
      await groupMessage.save();
      const data = await groupMessage.populate("user");
      io?.sockets.in(groupId).emit("message", data);
      io?.sockets.in(`${groupId}_notify`).emit("messageNotify", data);

      res.status(201).send({});
    } catch (error) {
      res.status(500).send({ msg: "Error", error: error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};

const sendImage = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();

    const { groupId } = req.body;
    const { id } = req.userData;
    let filePath;

    if (req.file) filePath = getFilePath(req.file);

    const groupMessage = new GroupMessage({
      group: groupId,
      user: id,
      message: filePath,
      type: "IMAGE",
    });

    try {
      await groupMessage.save();
      const data = await groupMessage.populate("user");
      io?.sockets.in(groupId).emit("message", data);
      io?.sockets.in(`${groupId}_notify`).emit("messageNotify", data);

      res.status(201).send({});
    } catch (error) {
      res.status(500).send({ msg: "Error", error: error });
    }
  } catch {
    res.status(500).send("server error");
  }
};

const getAll = async (req: modifyRequest, res: Response) => {
  const { id } = req.params;

  try {
    const message = await GroupMessage.find({ group: id })
      .sort({
        createAt: 1,
      })
      .populate("user");

    const total = await GroupMessage.countDocuments({ chat: id });

    res.status(200).send({ message, total });
  } catch {
    res.status(500).send("server error");
  }
};

const getTotalMessage = async (req: modifyRequest, res: Response) => {
  const { id } = req.params;

  try {
    const response = await GroupMessage.countDocuments({ chat: id });
    res.status(200).send(JSON.stringify(response));
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
};

const getLastMessage = async (req: modifyRequest, res: Response) => {
  const { id } = req.params;

  try {
    const response = await GroupMessage.findOne({ chat: id }).sort({
      createdAt: -1,
    });
    res.status(200).send(response || {});
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

export const groupMessageController = {
  sendText,
  sendImage,
  getAll,
  getTotalMessage,
  getLastMessage,
};
