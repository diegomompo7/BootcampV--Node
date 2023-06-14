import express, { type NextFunction, type Response, type Request, type ErrorRequestHandler } from "express";
import { mongoConnect } from "../domain/repositories/mongo-repository";
import { userRouter } from "./user.routes";
import { classroomRouter } from "./classroom.routes";
import { subjectRouter } from "./subject.routes";

export const configureRoutes = (app: any): any => {
  // Rutas
  const router = express.Router();

  // Middleware de conexión a Mongo
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    await mongoConnect();
    next();
  });

  router.get("/", (req: Request, res: Response) => {
    res.send(`
      <h3>Esta es la RAIZ de nuestra API.</h3>
    `);
  });

  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  // Usamos las rutas
  app.use("/public", express.static("public"));
  app.use("/subject", subjectRouter);
  app.use("/classroom", classroomRouter);
  app.use("/user", userRouter);
  app.use("/", router);

  // Middleware de gestión de errores
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** INICIO DE ERROR ***");
    console.log(`PETICIÓN FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN DE ERROR ***");

    // Truco para quitar el tipo a una variable
    const errorAsAny: any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsg && errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: errorAsAny.errmsg });
    } else if (errorAsAny?.code === "ER_NO_DEFAULT_FOR_FIELD") {
      res.status(400).json({ error: errorAsAny?.sqlMessage });
    } else {
      res.status(500).json(err);
    }
  });

  return app;
};
