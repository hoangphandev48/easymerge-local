import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'
import { createMemoryAuditRepository, type AuditEntry } from '../src/modules/products/product.audit.js'
import { createMemoryProductRepository } from './memory-product-repository.js'

const ADMIN = { Authorization: 'Bearer admin' }
const VIEWER = { Authorization: 'Bearer viewer' }
const PRODUCT_ID = '0b7c2f6e-6f0a-4c3e-9a55-3d6d0a1c1e11'

const authenticate = (req: { header(name: string): string | undefined }) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  return token ? { role: token } : null
}

const entry = (n: number): AuditEntry => ({
  id: `log-${n}`,
  productId: PRODUCT_ID,
  actor: 'admin',
  action: 'update',
  before: { price: '100.00' },
  after: { price: '200.00' },
  createdAt: `2026-10-17T05:00:0${n}Z`,
})

const appWith = (entries: AuditEntry[]) =>
  createApp({ products: createMemoryProductRepository(), authenticate, audit: createMemoryAuditRepository(entries) })

describe('GET /api/products/:id/audit', () => {
  it('lists history newest first with pagination meta', async () => {
    const res = await request(appWith([entry(1), entry(2), entry(3)]))
      .get(`/api/products/${PRODUCT_ID}/audit?limit=2`)
      .set(ADMIN)
    expect(res.status).toBe(200)
    expect(res.body.data.map((e: AuditEntry) => e.id)).toEqual(['log-3', 'log-2'])
    expect(res.body.meta).toEqual({ total: 3, page: 1, limit: 2 })
  })

  it('returns an empty list with 200 when there is no history', async () => {
    const res = await request(appWith([])).get(`/api/products/${PRODUCT_ID}/audit`).set(ADMIN)
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
    expect(res.body.meta.total).toBe(0)
  })

  it('rejects a malformed id and a limit above 100', async () => {
    const app = appWith([])
    expect((await request(app).get('/api/products/nope/audit').set(ADMIN)).status).toBe(400)
    expect((await request(app).get(`/api/products/${PRODUCT_ID}/audit?limit=101`).set(ADMIN)).status).toBe(400)
  })

  it('requires the admin role', async () => {
    const app = appWith([entry(1)])
    expect((await request(app).get(`/api/products/${PRODUCT_ID}/audit`)).status).toBe(401)
    expect((await request(app).get(`/api/products/${PRODUCT_ID}/audit`).set(VIEWER)).status).toBe(403)
  })
})
