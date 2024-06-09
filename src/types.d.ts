import { Request } from "express";

export interface registerEntry {
  email: string;
  password: string;
}

export interface loginEntry {
  email: string;
  password: string;
}

export interface modifyRequest extends Request {
  userData?: {
    token_type?: string;
    id?: string | number;
    iat?: number;
    exp?: number;
  };
  file?: Express.Multer.File;
}

export interface group {
  name: string;
}

export interface chat {
  _doc: any;
}
