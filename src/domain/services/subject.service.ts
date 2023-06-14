import { Request, Response, NextFunction } from "express";
import { subjectOdm } from "../odm/subject.odm";

export const getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // ONLY FOR ADMINS AND TEACHERS

    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" })
      return
    }
    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const subjects = await subjectOdm.getAllSubjects(page, limit);

    // Num total de elementos
    const totalElements = await subjectOdm.getSubjectCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: subjects,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subjectIdToShow = req.params.id;

    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" })
      return
    }

    const subject = await subjectOdm.getSubjectById(subjectIdToShow);

    if (subject) {
      const temporalSubject = subject.toObject();
      // TODO: RELLENAR LOS DATOS DE LOS ALUMNOS Y DE LAS ASIGNATURAS
      res.json(temporalSubject);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" })
      return
    }

    const createdSubject = await subjectOdm.createSubject(req.body);
    res.status(201).json(createdSubject);
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const subjectDeleted = await subjectOdm.deleteSubject(id);
    if (subjectDeleted) {
      res.json(subjectDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const subjectToUpdate = await subjectOdm.getSubjectById(id);
    if (subjectToUpdate) {
      Object.assign(subjectToUpdate, req.body);
      await subjectToUpdate.save();
      res.json(subjectToUpdate);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const subjectService = {
  getSubjects,
  getSubjectById,
  createSubject,
  deleteSubject,
  updateSubject,
};
