import express, { type Express, type Request, type Response } from "express";
import { createTodoRouter } from "./todos/todo.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

/** Tạo và cấu hình ứng dụng Express. Tách khỏi việc listen để dễ test. */
export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use("/todos", createTodoRouter());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
