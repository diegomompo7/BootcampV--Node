import { Document, Schema, model } from "mongoose";
import { Classroom, IClassroom } from "./classroom.entity";
import { IUser, User } from "./user.entity";

export interface ISubjectCreate {
  name: string;
  classroom: IClassroom;
  teacher: IUser;
}

export type ISubject = ISubjectCreate & Document;

const subjectSchema = new Schema<ISubjectCreate>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [10, "El nombre debe tener al menos 8 caracters, por ejemplo INGLES - 2 BACH"],
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: Classroom,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subject = model<ISubjectCreate>("Subject", subjectSchema, "subjects");
