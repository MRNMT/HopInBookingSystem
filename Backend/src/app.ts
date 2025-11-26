/// <reference path="./types/express/index.d.ts" />
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from './api/v1/index';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hotel App Backend is running!");
});
app.use('/api/v1', router);
export default app;
