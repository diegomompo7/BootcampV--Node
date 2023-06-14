import express from "express";
import cors from "cors";
import { configureRoutes } from "../routes/index";

// Configuración del server
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:4000",
  })
);

configureRoutes(app);
