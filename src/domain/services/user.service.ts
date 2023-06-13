import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { generateToken } from "../../utils/token";
import { userOdm } from "../odm/user.odm";

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // ONLY FOR ADMINS AND TEACHERS

    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" })
      return
    }
    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const users = await userOdm.getAllUsers(page, limit);

    // Num total de elementos
    const totalElements = await userOdm.getUserCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: users,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userIdToShow = req.params.id;

    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER" && req.user.id !== userIdToShow) {
      res.status(401).json({ error: "No tienes autorización para hacer esto" })
      return
    }

    const user = await userOdm.getUserById(userIdToShow);

    if (user) {
      const temporalUser = user.toObject();
      res.json(temporalUser);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" })
      return
    }

    const createdUser = await userOdm.createUser(req.body);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const userDeleted = await userOdm.deleteUser(id);
    if (userDeleted) {
      res.json(userDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const userToUpdate = await userOdm.getUserById(id);
    if (userToUpdate) {
      Object.assign(userToUpdate, req.body);
      await userToUpdate.save();
      // Quitamos pass de la respuesta
      const userToSend: any = userToUpdate.toObject();
      delete userToSend.password;
      res.json(userToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Se deben especificar los campos email y password" });
      return;
    }

    const user: any = await userOdm.getUserByEmailWithPassword(email);
    if (!user) {
      res.status(401).json({ error: "Email y/o contraseña incorrectos" });
      return;
    }

    // Comprueba la pass
    const userPassword: string = user.password;
    const match = await bcrypt.compare(password, userPassword);

    if (!match) {
      res.status(401).json({ error: "Email y/o contraseña incorrectos" });
      return;
    }

    // Generamos token JWT
    const jwtToken = generateToken(user._id.toString(), user.email);

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    next(error);
  }
};

export const userService = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  login,
};
