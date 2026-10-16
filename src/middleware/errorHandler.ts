import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../todos/todo.validation.js";

/** Tạo response lỗi theo định dạng thống nhất. */
export function errorBody(error: string): { success: false; data: null; error: string } {
  return { success: false, data: null, error };
}

/** Handler 404 cho các route không khớp. */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json(errorBody("Không tìm thấy tài nguyên"));
}

function isJsonParseError(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { type?: unknown }).type === "entity.parse.failed";
}

/**
 * Handler lỗi tập trung. Lỗi dữ liệu đầu vào trả 400; các lỗi khác được log
 * chi tiết ở phía server và chỉ trả về thông điệp an toàn cho client.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ValidationError) {
    res.status(400).json(errorBody(err.message));
    return;
  }
  if (isJsonParseError(err)) {
    res.status(400).json(errorBody("Body không phải JSON hợp lệ"));
    return;
  }
  console.error("[error]", err);
  res.status(500).json(errorBody("Đã có lỗi xảy ra trên máy chủ"));
}
