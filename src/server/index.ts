import express from "express";
import cors from "cors";
import { configureRoutes } from "../routes/index";

// Cargamos variables de entorno
import dotenv from "dotenv";
dotenv.config();

const FRONT_END_URL: string = process.env.FRONT_END_URL as string;

// Configuración del server
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: FRONT_END_URL,
  })
);

configureRoutes(app);
