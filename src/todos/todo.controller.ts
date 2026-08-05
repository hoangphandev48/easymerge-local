import type { Request, Response } from "express";
import { TodoRepository } from "./todo.repository.js";
import type { CreateTodoInput, UpdateTodoInput } from "./todo.types.js";

/**
 * Controller cho todo. Nhận repository qua constructor (dependency injection)
 * để dễ dàng thay thế khi test.
 */
export class TodoController {
  constructor(private readonly repository: TodoRepository) {}

  list = (_req: Request, res: Response): void => {
    res.json({ data: this.repository.findAll() });
  };

  getById = (req: Request, res: Response): void => {
    const todo = this.repository.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ error: "Không tìm thấy todo" });
      return;
    }
    res.json({ data: todo });
  };

  create = (req: Request, res: Response): void => {
    const title = (req.body as Partial<CreateTodoInput>)?.title;
    if (typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ error: "Trường 'title' là bắt buộc và không được rỗng" });
      return;
    }
    const todo = this.repository.create({ title: title.trim() });
    res.status(201).json({ data: todo });
  };

  update = (req: Request, res: Response): void => {
    const body = (req.body ?? {}) as Partial<UpdateTodoInput>;
    const input: UpdateTodoInput = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim() === "") {
        res.status(400).json({ error: "Trường 'title' không được rỗng" });
        return;
      }
      input.title = body.title.trim();
    }

    if (body.completed !== undefined) {
      if (typeof body.completed !== "boolean") {
        res.status(400).json({ error: "Trường 'completed' phải là boolean" });
        return;
      }
      input.completed = body.completed;
    }

    const updated = this.repository.update(req.params.id, input);
    if (!updated) {
      res.status(404).json({ error: "Không tìm thấy todo" });
      return;
    }
    res.json({ data: updated });
  };

  remove = (req: Request, res: Response): void => {
    const deleted = this.repository.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Không tìm thấy todo" });
      return;
    }
    res.status(204).send();
  };
}
