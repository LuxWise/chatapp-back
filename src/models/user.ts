import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  username: String,
  firstname: String,
  lastname: String,
  password: String,
  avatar: String,
});

export const User = mongoose.model("user", userSchema);
