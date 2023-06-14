import { Request, Response, NextFunction } from "express";
import { classroomOdm } from "../odm/classroom.odm";
import { userOdm } from "../odm/user.odm";
import { subjectOdm } from "../odm/subject.odm";

export const getClassrooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // ONLY FOR ADMINS AND TEACHERS

    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" })
      return
    }
    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const classrooms = await classroomOdm.getAllClassrooms(page, limit);

    // Num total de elementos
    const totalElements = await classroomOdm.getClassroomCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: classrooms,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getClassroomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classroomIdToShow = req.params.id;

    if (req.user.rol !== "ADMIN" && req.user.rol !== "TEACHER") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" })
      return
    }

    const classroom = await classroomOdm.getClassroomById(classroomIdToShow);

    if (classroom) {
      const classroomToSend = classroom.toObject();

      const students = await userOdm.getStudentsByClassroomId(classroom.id);
      const subjects = await subjectOdm.getSubjectsByClassroomId(classroom.id);

      classroomToSend.students = students;
      classroomToSend.subjects = subjects;
      res.json(classroomToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" })
      return
    }

    const createdClassroom = await classroomOdm.createClassroom(req.body);
    res.status(201).json(createdClassroom);
  } catch (error) {
    next(error);
  }
};

export const deleteClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const classroomDeleted = await classroomOdm.deleteClassroom(id);
    if (classroomDeleted) {
      res.json(classroomDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const classroomToUpdate = await classroomOdm.getClassroomById(id);
    if (classroomToUpdate) {
      Object.assign(classroomToUpdate, req.body);
      await classroomToUpdate.save();
      res.json(classroomToUpdate);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const classroomService = {
  getClassrooms,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
};
