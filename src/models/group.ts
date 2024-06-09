import mongoose, { Schema } from "mongoose";

const GroupSchema = new Schema({
  name: String,
  image: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

export const Group = mongoose.model("group", GroupSchema);
