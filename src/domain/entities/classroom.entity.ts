import { Document, Schema, model } from "mongoose";

export interface IClassroomCreate {
  name: string;
}

export type IClassroom = IClassroomCreate & Document;

const classroomSchema = new Schema<IClassroomCreate>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: [5, "El nombre de la clase debe tener al menos 5 caracteres, por ejemplo 2 ESO, 1 BACH... etc"],
    },
  },
  {
    timestamps: true,
  }
);

export const Classroom = model<IClassroomCreate>("Classroom", classroomSchema, "classrooms");
