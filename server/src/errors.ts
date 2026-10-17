export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: Record<string, string>,
  ) {
    super(message)
  }
}

export const notFound = (message = 'Không tìm thấy') => new AppError(404, 'NOT_FOUND', message)
