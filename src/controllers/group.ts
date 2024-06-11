import mongoose from "mongoose";
import { Response } from "express";
import { modifyRequest } from "../types";
import { Group, GroupMessage } from "../models";
import { getFilePath } from "../utils";
import { User } from "../models";

const getAll = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();
    const { id } = req.userData;

    const response = await Group.find({ participants: id })
      .populate("creator")
      .populate("participants");

    if (!response) {
      res.status(400).send("Error getting participants");
    } else {
      const arrayGroups = [];
      for await (const group of response) {
        const groupObj = group.toObject();
        const response = await GroupMessage.findOne({ group: group._id }).sort({
          createAt: -1,
        });

        arrayGroups.push({
          ...groupObj,
          last_message_dat: response?.createdAt || null,
        });
      }

      res.status(200).send(arrayGroups);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
};

const getGroup = async (req: modifyRequest, res: Response) => {
  try {
    const { id } = req.params;
    const response = await Group.findById(id);

    if (!response) {
      res.status(400).send("unknown group");
    } else {
      res.status(200).send(response);
    }
  } catch (err) {
    res.status(500).send("server error");
  }
};

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
    try {
      const groupStorage = await group.save();
      res.status(201).send(groupStorage);
    } catch (error) {
      res.status(500).send({ msg: "Error", error: error });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
};

const updateGroup = async (req: modifyRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const group = await Group.findById(id);

    if (!group) throw new Error();

    if (name) group.name = name;

    if (req.file) {
      const imagePath = getFilePath(req.file);
      group.image = imagePath;
    }

    const response = Group.findByIdAndUpdate(id, group);
    if (!response) {
      res.status(400).send("group info erro");
    } else {
      res.status(200).send({ image: group.image, name: group.name });
    }
  } catch (err) {
    res.status(500).send("server error");
  }
};

const addParticipants = async (req: modifyRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { usersId } = req.body;
    const group = await Group.findById(id);
    const users = await User.find({ _id: usersId });

    if (!group) throw new Error();

    if (!users) {
      res.status(404).send("Group not found");
      return;
    }

    const arrayNewParticipants: mongoose.Types.ObjectId[] = [];
    users.map(user => arrayNewParticipants.push(user._id));

    const allParticipantsSet = new Set([
      ...group.participants.map(id => id.toString()),
      ...arrayNewParticipants.map(id => id.toString()),
    ]);

    const allParticipants = Array.from(allParticipantsSet).map(
      id => new mongoose.Types.ObjectId(id)
    );

    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { $set: { participants: allParticipants } },
      { new: true }
    );

    res.status(200).send(updatedGroup);
  } catch {
    res.status(500).send("server error");
  }
};

const exitGroup = async (req: modifyRequest, res: Response) => {
  try {
    if (!req.userData) throw new Error();

    const { id } = req.params;
    const userId = req.userData.id;
    const group = await Group.findById(id);

    if (!group) throw new Error();

    const updatedParticipants = group.participants.filter(
      participant => participant.toString() !== userId
    );

    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { $set: { participants: updatedParticipants } },
      { new: true }
    );

    if (!updatedGroup) {
      res.status(404).send("Error updating group");
      return;
    }

    res.status(200).send(updatedGroup.participants);
  } catch (err) {
    res.status(500).send("server error");
  }
};

const banParticipant = async (req: modifyRequest, res: Response) => {
  try {
    const { groupId, userId } = req.body;
    console.log(groupId, userId);
    const group = await Group.findById(groupId);

    if (!group) throw new Error();

    const updatedParticipants = group.participants.filter(
      participant => participant.toString() !== userId
    );

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $set: { participants: updatedParticipants } },
      { new: true }
    );

    if (!updatedGroup) {
      res.status(404).send("Error updating group");
      return;
    }

    res.status(200).send({ msg: "ban success" });
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
};

export const groupController = {
  getAll,
  getGroup,
  create,
  updateGroup,
  addParticipants,
  exitGroup,
  banParticipant,
};
