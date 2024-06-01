import mongoose, { Schema } from "mongoose";

const chatMessageSchema = new Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    message: String,
    type: {
      type: String,
      enum: ["TEXT", "IMAGE"],
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = mongoose.model("chatMessage", chatMessageSchema);
