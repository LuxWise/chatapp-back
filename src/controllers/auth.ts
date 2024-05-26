import bcript from "bcryptjs";
import { User } from "../models";
import { loginEntry, registerEntry } from "../types";
import { Request, Response } from "express";
import { jwt } from "../utils";
import { JwtPayload } from "jsonwebtoken";

const register = async (
  req: Request<{}, {}, registerEntry>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const user = new User({
    email: email.toLowerCase(),
  });

  const salt = bcript.genSaltSync(10);
  const hashPassword = bcript.hashSync(password, salt);
  user.password = hashPassword;

  try {
    const userStorage = await user.save();
    res.status(201).send(userStorage);
  } catch (error) {
    res.status(500).send({ msg: "Error", error: error });
  }
};

const login = async (
  req: Request<{}, {}, loginEntry>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userStorage = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!userStorage) {
      res.status(404).send("User not found");
      return;
    }

    if (!userStorage.password) {
      res.status(400).send("User password not found");
      return;
    }

    const match = await bcript.compare(password, userStorage.password);

    if (!match) {
      res.status(400).send("Password bad");
    } else {
      const userObject = {
        _id: userStorage.id,
      };

      res.status(200).send({
        access: jwt.createAccessToken(userObject),
        refresh: jwt.createRefreshToken(userObject),
      });
    }
  } catch (error) {
    res.status(500).send({ msg: "Error", error: error });
  }
};

const refreshAccesToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) res.status(400).send("Token requerido");

  const token = jwt.hasExpiredToken(refreshToken);

  if (token) res.status(400).send("Every bad");

  const decodedToken = jwt.decoded(refreshToken);

  const { id } = decodedToken as JwtPayload;

  try {
    const userStorage = await User.findById(id);

    if (!userStorage) {
      if (token) res.status(400).send("Every bad");
    } else {
      const userObject = {
        _id: userStorage.id,
      };

      res.status(200).send({
        accessToken: jwt.createAccessToken(userObject),
      });
    }
  } catch (error) {}
};

export const authController = { register, login, refreshAccesToken };
