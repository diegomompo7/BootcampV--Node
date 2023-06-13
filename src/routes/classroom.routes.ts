import express from "express";
import { classroomService } from "../domain/services/classroom.service";
import { isAuth } from "../utils/auth.middleware";

// Router propio de usuarios
export const classroomRouter = express.Router();

classroomRouter.get("/", isAuth, classroomService.getClassrooms);
classroomRouter.get("/:id", isAuth, classroomService.getClassroomById);
classroomRouter.post("/", isAuth, classroomService.createClassroom);
classroomRouter.delete("/:id", isAuth, classroomService.deleteClassroom);
classroomRouter.put("/:id", isAuth, classroomService.updateClassroom);
