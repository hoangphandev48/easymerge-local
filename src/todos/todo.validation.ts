import type {
  CreateTodoInput,
  SortOrder,
  TodoPriority,
  TodoQuery,
  TodoSortField,
  UpdateTodoInput,
} from "./todo.types.js";

/** Lỗi dữ liệu đầu vào; errorHandler sẽ chuyển thành HTTP 400. */
export class ValidationError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const PRIORITIES: readonly TodoPriority[] = ["low", "medium", "high"];
const SORT_FIELDS: readonly TodoSortField[] = ["createdAt", "updatedAt", "priority", "dueDate"];
const ORDERS: readonly SortOrder[] = ["asc", "desc"];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function oneOf<T extends string>(value: unknown, allowed: readonly T[], name: string): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new ValidationError(`Tham số '${name}' phải là một trong: ${allowed.join(", ")}`);
  }
  return value as T;
}

function parseInteger(value: unknown, name: string, min: number, max: number): number {
  const n = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new ValidationError(`Tham số '${name}' phải là số nguyên từ ${min} đến ${max}`);
  }
  return n;
}

function parseTitle(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError("Trường 'title' là bắt buộc và không được rỗng");
  }
  return value.trim();
}

function parseDueDate(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new ValidationError("Trường 'dueDate' phải là chuỗi ngày ISO 8601 hoặc null");
  }
  return value;
}

export function parseQuery(query: Record<string, unknown>): TodoQuery {
  const { completed, q, sort, order, page, limit } = query;

  if (q !== undefined && typeof q !== "string") {
    throw new ValidationError("Tham số 'q' phải là chuỗi");
  }
  if (completed !== undefined && completed !== "true" && completed !== "false") {
    throw new ValidationError("Tham số 'completed' phải là 'true' hoặc 'false'");
  }

  const search = q?.trim();
  return {
    ...(completed !== undefined ? { completed: completed === "true" } : {}),
    ...(search ? { q: search } : {}),
    sort: sort === undefined ? "createdAt" : oneOf(sort, SORT_FIELDS, "sort"),
    order: order === undefined ? "desc" : oneOf(order, ORDERS, "order"),
    page: page === undefined ? 1 : parseInteger(page, "page", 1, Number.MAX_SAFE_INTEGER),
    limit: limit === undefined ? DEFAULT_LIMIT : parseInteger(limit, "limit", 1, MAX_LIMIT),
  };
}

export function parseCreateInput(body: unknown): CreateTodoInput {
  const data = (body ?? {}) as Record<string, unknown>;
  return {
    title: parseTitle(data.title),
    ...(data.priority !== undefined ? { priority: oneOf(data.priority, PRIORITIES, "priority") } : {}),
    ...(data.dueDate !== undefined ? { dueDate: parseDueDate(data.dueDate) } : {}),
  };
}

export function parseUpdateInput(body: unknown): UpdateTodoInput {
  const data = (body ?? {}) as Record<string, unknown>;

  if (data.completed !== undefined && typeof data.completed !== "boolean") {
    throw new ValidationError("Trường 'completed' phải là boolean");
  }

  return {
    ...(data.title !== undefined ? { title: parseTitle(data.title) } : {}),
    ...(data.completed !== undefined ? { completed: data.completed as boolean } : {}),
    ...(data.priority !== undefined ? { priority: oneOf(data.priority, PRIORITIES, "priority") } : {}),
    ...(data.dueDate !== undefined ? { dueDate: parseDueDate(data.dueDate) } : {}),
  };
}
