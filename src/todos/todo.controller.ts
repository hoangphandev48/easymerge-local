import type { Request, Response } from "express";
import { errorBody } from "../middleware/errorHandler.js";
import { TodoRepository } from "./todo.repository.js";
import { parseCreateInput, parseQuery, parseUpdateInput } from "./todo.validation.js";

function ok<T>(data: T): { success: true; data: T; error: null } {
  return { success: true, data, error: null };
}

/**
 * Controller cho todo. Nhận repository qua constructor (dependency injection)
 * để dễ dàng thay thế khi test. Lỗi validation được ném ra và xử lý ở errorHandler.
 */
export class TodoController {
  constructor(private readonly repository: TodoRepository) {}

  list = (req: Request, res: Response): void => {
    const query = parseQuery(req.query);
    res.json(ok(this.repository.search(query)));
  };

  stats = (_req: Request, res: Response): void => {
    res.json(ok(this.repository.stats()));
  };

  getById = (req: Request, res: Response): void => {
    const todo = this.repository.findById(req.params.id);
    if (!todo) {
      res.status(404).json(errorBody("Không tìm thấy todo"));
      return;
    }
    res.json(ok(todo));
  };

  create = (req: Request, res: Response): void => {
    const todo = this.repository.create(parseCreateInput(req.body));
    res.status(201).json(ok(todo));
  };

  update = (req: Request, res: Response): void => {
    const updated = this.repository.update(req.params.id, parseUpdateInput(req.body));
    if (!updated) {
      res.status(404).json(errorBody("Không tìm thấy todo"));
      return;
    }
    res.json(ok(updated));
  };

  remove = (req: Request, res: Response): void => {
    const deleted = this.repository.delete(req.params.id);
    if (!deleted) {
      res.status(404).json(errorBody("Không tìm thấy todo"));
      return;
    }
    res.status(204).send();
  };
}
