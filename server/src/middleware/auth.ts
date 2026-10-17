import type { RequestHandler } from 'express'
import { AppError } from '../errors.js'

export interface AuthUser {
  readonly role: string
}

export type Authenticate = (req: { header(name: string): string | undefined }) => AuthUser | null

export const requireAdmin =
  (authenticate: Authenticate): RequestHandler =>
  (req, _res, next) => {
    const user = authenticate(req)
    if (!user) return next(new AppError(401, 'UNAUTHORIZED', 'Chưa đăng nhập'))
    if (user.role !== 'admin') return next(new AppError(403, 'FORBIDDEN', 'Không đủ quyền'))
    next()
  }
