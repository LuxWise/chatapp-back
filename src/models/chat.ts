import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
  participantOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  participantTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

export const Chat = mongoose.model("chat", chatSchema);
