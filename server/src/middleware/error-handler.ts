import type { ErrorRequestHandler } from 'express'
import { AppError } from '../errors.js'
import { fail } from '../envelope.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json(fail(err.code, err.message, err.fields))
    return
  }
  // Client errors raised by body-parser (malformed JSON, 413 too large, bad charset...).
  const status = (err as { status?: unknown })?.status
  if (typeof status === 'number' && status >= 400 && status < 500) {
    const code = status === 413 ? 'PAYLOAD_TOO_LARGE' : 'VALIDATION_ERROR'
    const message = status === 413 ? 'Dữ liệu gửi lên quá lớn' : 'Yêu cầu không hợp lệ'
    res.status(status).json(fail(code, message))
    return
  }
  console.error('Unhandled error', err)
  res.status(500).json(fail('INTERNAL_ERROR', 'Đã xảy ra lỗi, vui lòng thử lại'))
}
