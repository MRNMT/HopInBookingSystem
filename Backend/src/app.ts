/// <reference path="./types/express/index.d.ts" />
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";

import router from './api/v1/index';
import { globalErrorHandler } from './middleware/error.handler';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hotel App Backend is running!");
});
app.use('/api/v1', router);

// Global error handler must be registered AFTER all routes
app.use(globalErrorHandler);

export default app;
