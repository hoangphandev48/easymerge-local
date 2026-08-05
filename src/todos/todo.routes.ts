import { Router } from "express";
import { TodoController } from "./todo.controller.js";
import { TodoRepository } from "./todo.repository.js";

/**
 * Lắp ráp router cho tài nguyên todo.
 * Cho phép truyền repository từ ngoài vào để test tách biệt.
 */
export function createTodoRouter(repository: TodoRepository = new TodoRepository()): Router {
  const controller = new TodoController(repository);
  const router = Router();

  router.get("/", controller.list);
  router.post("/", controller.create);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);

  return router;
}
