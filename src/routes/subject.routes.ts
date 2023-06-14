import express from "express";
import { subjectService } from "../domain/services/subject.service";
import { isAuth } from "../utils/auth.middleware";

// Router propio de usuarios
export const subjectRouter = express.Router();

subjectRouter.get("/", isAuth, subjectService.getSubjects);
subjectRouter.get("/:id", isAuth, subjectService.getSubjectById);
subjectRouter.post("/", isAuth, subjectService.createSubject);
subjectRouter.delete("/:id", isAuth, subjectService.deleteSubject);
subjectRouter.put("/:id", isAuth, subjectService.updateSubject);
