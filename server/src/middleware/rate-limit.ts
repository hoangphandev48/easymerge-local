import { rateLimit } from 'express-rate-limit'
import { fail } from '../envelope.js'

export interface RateLimitOptions {
  readonly windowMs: number
  readonly max: number
}

export const DEFAULT_RATE_LIMIT: RateLimitOptions = { windowMs: 60_000, max: 100 }

export const createRateLimiter = ({ windowMs, max }: RateLimitOptions) =>
  rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json(fail('RATE_LIMITED', 'Quá nhiều yêu cầu, vui lòng thử lại sau'))
    },
  })
