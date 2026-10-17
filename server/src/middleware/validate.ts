import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'
import { AppError } from '../errors.js'

type Source = 'body' | 'query' | 'params'

/** Validates a request part and stores the parsed value in res.locals[source]. */
export const validate =
  (source: Source, schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (result.success) {
      res.locals[source] = result.data
      return next()
    }
    const fields: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || '_'
      fields[key] ??= issue.message
    }
    next(new AppError(400, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ', fields))
  }
