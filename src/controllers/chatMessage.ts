import { ChatMessage } from "../models/chatMessage";
import { Response } from "express";
import { modifyRequest } from "../types";
import { getFilePath, io } from "../utils";

const sendText = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();

    const { chatId, message } = req.body;
    const { id } = req.userData;

    const chatMessage = new ChatMessage({
      chat: chatId,
      user: id,
      message,
      type: "TEXT",
    });

    try {
      await chatMessage.save();
      const data = await chatMessage.populate("user");
      io?.sockets.in(chatId).emit("message", data);
      io?.sockets.in(`${chatId}_notify`).emit("messageNotify", data);

      res.status(201).send({});
    } catch (error) {
      res.status(500).send({ msg: "Error", error: error });
    }
  } catch {
    res.status(500).send("server error");
  }
};

const sendImage = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();

    const { chatId } = req.body;
    const { id } = req.userData;
    let filePath;

    if (req.file) filePath = getFilePath(req.file);

    const chatMessage = new ChatMessage({
      chat: chatId,
      user: id,
      message: filePath,
      type: "IMAGE",
    });

    try {
      await chatMessage.save();
      const data = await chatMessage.populate("user");
      io?.sockets.in(chatId).emit("message", data);
      io?.sockets.in(`${chatId}_notify`).emit("messageNotify", data);

      res.status(201).send({});
    } catch {}
  } catch {
    res.status(500).send("server error");
  }
};

const getAll = async (req: modifyRequest, res: Response) => {
  const { id } = req.params;

  try {
    const message = await ChatMessage.find({ chat: id })
      .sort({
        createAt: 1,
      })
      .populate("user");

    const total = await ChatMessage.countDocuments({ chat: id });

    res.status(200).send({ message, total });
  } catch {
    res.status(500).send("server error");
  }
};

const getTotalMessage = async (req: modifyRequest, res: Response) => {
  const { id } = req.params;
  try {
    const response = await ChatMessage.countDocuments({ chat: id });
    res.status(200).send(JSON.stringify(response));
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
};

const getLastMessage = async (req: modifyRequest, res: Response) => {
  const { id } = req.params;

  try {
    const response = await ChatMessage.findOne({ chat: id }).sort({
      createdAt: -1,
    });
    res.status(200).send(response || {});
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
};

export const chatMessageController = {
  sendText,
  sendImage,
  getAll,
  getTotalMessage,
  getLastMessage,
};
