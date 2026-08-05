import { randomUUID } from "node:crypto";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "./todo.types.js";

/**
 * Repository lưu todo trong bộ nhớ.
 *
 * Tuân theo nguyên tắc bất biến: mỗi thao tác ghi trả về một object Todo mới,
 * không sửa đổi tại chỗ object đang lưu.
 */
export class TodoRepository {
  private todos: Todo[] = [];

  findAll(): Todo[] {
    return [...this.todos];
  }

  findById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  create(input: CreateTodoInput): Todo {
    const todo: Todo = {
      id: randomUUID(),
      title: input.title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.todos = [...this.todos, todo];
    return todo;
  }

  update(id: string, input: UpdateTodoInput): Todo | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const updated: Todo = {
      ...existing,
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.completed !== undefined ? { completed: input.completed } : {}),
    };
    this.todos = this.todos.map((todo) => (todo.id === id ? updated : todo));
    return updated;
  }

  delete(id: string): boolean {
    const exists = this.todos.some((todo) => todo.id === id);
    if (!exists) return false;
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return true;
  }
}
