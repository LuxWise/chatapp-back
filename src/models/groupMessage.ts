import mongoose, { Schema } from "mongoose";

const GroupMessageSchema = new Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
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

export const GroupMessage = mongoose.model("groupMessage", GroupMessageSchema);
