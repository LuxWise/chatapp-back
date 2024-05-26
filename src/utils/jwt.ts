import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

interface User {
  _id: string | number;
}

const createAccessToken = (user: User) => {
  const payload = {
    token_type: "access",
    id: user._id,
  };
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

const createRefreshToken = (user: User) => {
  const payload = {
    token_type: "refresh",
    id: user._id,
  };
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: "30d" });
};

const decoded = (token: string): string | JwtPayload | null => {
  return jsonwebtoken.decode(token);
};

const hasExpiredToken = (token: string): boolean => {
  try {
    const decodedToken = decoded(token);
    const currentDate = Math.floor(Date.now() / 1000);

    if (!decodedToken) return true;

    const { exp } = decodedToken as JwtPayload;

    if (!exp) return true;
    if (exp <= currentDate) return true;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return true;
  }

  return false;
};

export const jwt = {
  createAccessToken,
  createRefreshToken,
  decoded,
  hasExpiredToken,
};
