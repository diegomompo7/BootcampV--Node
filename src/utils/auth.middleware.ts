import { NextFunction, Response, Request } from "express";
import { verifyToken } from "./token";
import { User } from "../domain/entities/user.entity";

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<null> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    // Descodificamos el token
    const decodedInfo = verifyToken(token);
    const user = await User.findOne({ email: decodedInfo.userEmail }).select("+password");
    if (!user) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    req.user = {
      id: user.id,
      rol: user.rol as unknown as CUSTOM_ROL
    };
    next();

    return null;
  } catch (error) {
    res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    return null;
  }
};

module.exports = { isAuth };
