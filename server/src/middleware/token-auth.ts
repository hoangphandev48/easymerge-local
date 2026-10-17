import { createHash, timingSafeEqual } from 'node:crypto'
import type { Authenticate } from './auth.js'

export const MIN_TOKEN_LENGTH = 16

const digest = (value: string) => createHash('sha256').update(value).digest()

/** Static bearer-token auth granting the admin role. Placeholder until real sessions/JWT exist. */
export function createStaticTokenAuth(token: string): Authenticate {
  if (token.length < MIN_TOKEN_LENGTH) {
    throw new Error(`ADMIN_TOKEN must be at least ${MIN_TOKEN_LENGTH} characters`)
  }
  const expected = digest(token)
  return (req) => {
    const header = req.header('Authorization')
    if (!header?.startsWith('Bearer ')) return null
    return timingSafeEqual(digest(header.slice(7)), expected) ? { role: 'admin' } : null
  }
}
