import { Response } from "express";
import { modifyRequest } from "../types";
import { Group } from "../models/group";
import { getFilePath } from "../utils";
import mongoose from "mongoose";

const create = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();
    const { id } = req.userData;
    const group = new Group(req.body);
    group.creator = new mongoose.Types.ObjectId(id);
    group.participants = JSON.parse(req.body.participants);
    group.participants = [
      ...group.participants,
      new mongoose.Types.ObjectId(id),
    ];

    if (req.file) {
      const imagePath = getFilePath(req.file);
      group.image = imagePath;
    }

    console.log(group);
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
};

export const groupController = { create };
