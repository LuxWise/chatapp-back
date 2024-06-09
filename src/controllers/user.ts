import { User } from "../models";
import { Response } from "express";
import { modifyRequest } from "../types";
import { getFilePath } from "../utils";

const getMe = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();
    const { id } = req.userData;
    const response = await User.findById(id).select(["-password"]);

    if (!response) {
      res.status(400).send("user undefind");
    } else {
      res.status(200).send(response);
    }
  } catch {
    res.status(500).send("server error");
  }
};

const getUsers = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();
    const { id } = req.userData;
    const response = await User.find({ _id: { $ne: id } }).select([
      "-password",
    ]);

    if (!response) {
      res.status(400).send("user undefind");
    } else {
      res.status(200).send(response);
    }
  } catch {
    res.status(500).send("server error");
  }
};

const getUser = async (req: modifyRequest, res: Response) => {
  try {
    const { id } = req.params;
    const response = await User.findById(id).select(["-password"]);

    if (!response) {
      res.status(400).send("user undefind");
    } else {
      res.status(200).send(response);
    }
  } catch {
    res.status(500).send("server error");
  }
};

const updateUser = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();
    const { id } = req.userData;
    const userData = req.body;

    if (req.file) {
      const filePath = getFilePath(req.file);
      userData.avatar = filePath;
    }

    const response = await User.findByIdAndUpdate({ _id: id }, userData);
    if (!response) {
      res.status(400).send("user undefind");
    } else {
      res.status(200).send(userData);
    }
  } catch {
    res.status(500).send("server error");
  }
};

export const userController = { getMe, getUsers, getUser, updateUser };
