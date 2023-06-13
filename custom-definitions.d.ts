enum CUSTOM_ROL {
  "STUDENT" = "STUDENT",
  "TEACHER" = "TEACHER",
  "PARENT" = "PARENT",
  "ADMIN" = "ADMIN",
}

declare namespace Express {
  export interface Request {
    user: {
      rol: CUSTOM_ROL;
      id: string;
    };
  }
}
