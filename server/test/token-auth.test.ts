import { describe, expect, it } from 'vitest'
import { createStaticTokenAuth } from '../src/middleware/token-auth.js'

const TOKEN = 'a-sufficiently-long-secret'
const req = (header?: string) => ({ header: () => header })

describe('createStaticTokenAuth', () => {
  const auth = createStaticTokenAuth(TOKEN)

  it('accepts the correct bearer token as admin', () => {
    expect(auth(req(`Bearer ${TOKEN}`))).toEqual({ role: 'admin' })
  })

  it.each([undefined, '', 'Bearer ', 'Bearer wrong', TOKEN, `Basic ${TOKEN}`])('rejects %j', (header) => {
    expect(auth(req(header))).toBeNull()
  })

  it('refuses a short token at startup', () => {
    expect(() => createStaticTokenAuth('short')).toThrow(/at least/)
  })
})
