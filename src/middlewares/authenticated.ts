import { NextFunction, Request, Response } from "express";
import { jwt } from "../utils";

interface CustomRequest extends Request {
  userData?: any;
}

const asureAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(400).send({ msg: "El token ha expirado" });
  }
  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const hasExpired = jwt.hasExpiredToken(token);

    if (hasExpired) {
      return res.status(400).send({ msg: "El token ha expirado" });
    }

    const payload = jwt.decoded(token);
    req.userData = payload;

    next();
  } catch (error) {
    return res.status(400).send({ msg: "Token invalido" });
  }

  return null;
};

export const middleware = { asureAuth };
