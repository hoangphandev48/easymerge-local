import type { NextFunction, Request, Response } from "express";

/** Handler 404 cho các route không khớp. */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Không tìm thấy tài nguyên" });
}

/**
 * Handler lỗi tập trung. Log chi tiết ở phía server, chỉ trả về
 * thông điệp an toàn cho client.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("[error]", err);
  res.status(500).json({ error: "Đã có lỗi xảy ra trên máy chủ" });
}
