// import { User } from "../models";

import { Request, Response } from "express";

const getMe = async (_req: Request, res: Response) => {
  res.status(200).send("OK");
};

export const userController = { getMe };
