import { randomUUID } from "node:crypto";
import type {
  CreateTodoInput,
  Paginated,
  Todo,
  TodoFilter,
  TodoPriority,
  TodoQuery,
  TodoStats,
  UpdateTodoInput,
} from "./todo.types.js";

const PRIORITY_RANK: Record<TodoPriority, number> = { low: 0, medium: 1, high: 2 };

/**
 * Repository lưu todo trong bộ nhớ.
 *
 * Tuân theo nguyên tắc bất biến: mỗi thao tác ghi trả về một object Todo mới,
 * không sửa đổi tại chỗ object đang lưu.
 */
export class TodoRepository {
  private todos: Todo[] = [];

  findAll(filter: TodoFilter = {}): Todo[] {
    return this.todos.filter((todo) =>
      filter.completed === undefined ? true : todo.completed === filter.completed,
    );
  }

  /** Tìm kiếm, sắp xếp và phân trang. Không làm thay đổi dữ liệu đang lưu. */
  search(query: TodoQuery): Paginated<Todo> {
    const keyword = query.q?.toLowerCase();
    const matched = this.findAll(
      query.completed === undefined ? {} : { completed: query.completed },
    ).filter((todo) => (keyword ? todo.title.toLowerCase().includes(keyword) : true));

    const sorted = [...matched].sort((a, b) => compareTodos(a, b, query));
    const start = (query.page - 1) * query.limit;
    return {
      items: sorted.slice(start, start + query.limit),
      total: sorted.length,
      page: query.page,
      limit: query.limit,
    };
  }

  stats(now: Date = new Date()): TodoStats {
    const completed = this.todos.filter((todo) => todo.completed).length;
    const overdue = this.todos.filter(
      (todo) => !todo.completed && todo.dueDate !== null && Date.parse(todo.dueDate) < now.getTime(),
    ).length;
    return {
      total: this.todos.length,
      completed,
      pending: this.todos.length - completed,
      overdue,
    };
  }

  findById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  create(input: CreateTodoInput): Todo {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: randomUUID(),
      title: input.title,
      completed: false,
      priority: input.priority ?? "medium",
      dueDate: input.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
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
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
      updatedAt: new Date().toISOString(),
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

/** So sánh theo trường sort; todo không có dueDate luôn xếp cuối. */
function compareTodos(a: Todo, b: Todo, { sort, order }: Pick<TodoQuery, "sort" | "order">): number {
  const direction = order === "asc" ? 1 : -1;

  if (sort === "dueDate") {
    if (a.dueDate === null && b.dueDate === null) return 0;
    if (a.dueDate === null) return 1;
    if (b.dueDate === null) return -1;
    return (Date.parse(a.dueDate) - Date.parse(b.dueDate)) * direction;
  }
  if (sort === "priority") {
    return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * direction;
  }
  return a[sort].localeCompare(b[sort]) * direction;
}
