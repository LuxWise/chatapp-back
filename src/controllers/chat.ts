import { Chat } from "../models";
import { Request, Response } from "express";
import { modifyRequest } from "../types";
import { ChatMessage } from "../models/chatMessage";

const getAll = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();
    const { id } = req.userData;

    const response = await Chat.find({
      $or: [{ participantOne: id }, { participantTwo: id }],
    })
      .populate("participantOne")
      .populate("participantTwo");

    if (!response) {
      res.status(400).send("error to find chats");
    } else {
      const arrayChats = [];
      for await (const chat of response) {
        const chatObj = chat.toObject();
        const response = await ChatMessage.findOne({ chat: chat._id }).sort({
          createAt: -1,
        });

        arrayChats.push({
          ...chatObj,
          last_message_dat: response?.createdAt || null,
        });
      }

      res.status(200).send(arrayChats);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};

const getChat = async (req: modifyRequest, res: Response) => {
  try {
    const { id } = req.params;
    const response = await Chat.findById(id)
      .populate("participantOne")
      .populate("participantTwo");

    if (!response) {
      res.status(200).send("error to find chat");
    } else {
      res.status(200).send(response);
    }
  } catch {
    res.status(500).send("server error");
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { idParticipantOne, idParticipantTwo } = req.body;

    const foundOne = await Chat.findOne({
      participantOne: idParticipantOne,
      participantTwo: idParticipantTwo,
    });

    const foundTwo = await Chat.findOne({
      participantOne: idParticipantTwo,
      participantTwo: idParticipantOne,
    });

    if (foundOne || foundTwo) {
      res.status(200).send("Chat already created");
      return;
    }

    const chat = new Chat({
      participantOne: idParticipantOne,
      participantTwo: idParticipantTwo,
    });

    try {
      const chatStorage = await chat.save();
      res.status(201).send(chatStorage);
    } catch (error) {
      res.status(500).send({ msg: "Error", error: error });
    }
  } catch {
    res.status(500).send("server error");
  }
};

const deleteChat = async (req: modifyRequest, res: Response) => {
  try {
    const { id } = req.params;
    const response = await Chat.findByIdAndDelete(id);

    if (!response) {
      res.status(200).send("error to delete");
    } else {
      res.status(200).send("chat delete");
    }
  } catch {
    res.status(500).send("server error");
  }
};

export const ChatController = { getAll, getChat, create, deleteChat };
