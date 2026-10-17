import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'
import { createMemoryProductRepository } from './memory-product-repository.js'

const ADMIN = { Authorization: 'Bearer admin' }
const VIEWER = { Authorization: 'Bearer viewer' }
const MISSING_ID = '00000000-0000-4000-8000-000000000000'

const authenticate = (req: { header(name: string): string | undefined }) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  return token ? { role: token } : null
}

const sample = { name: 'Áo thun', sku: 'AT-001', price: 199000, stock: 10, status: 'active' }

let app: ReturnType<typeof createApp>

beforeEach(() => {
  app = createApp({ products: createMemoryProductRepository(), authenticate })
})

const create = (body: object = sample) => request(app).post('/api/products').set(ADMIN).send(body)

describe('authorization', () => {
  it('returns 401 without credentials', async () => {
    const res = await request(app).get('/api/products')
    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({ success: false, data: null, error: { code: 'UNAUTHORIZED' } })
  })

  it('returns 403 for non-admin', async () => {
    const res = await request(app).get('/api/products').set(VIEWER)
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })
})

describe('POST /api/products', () => {
  it('creates a product with price as a 2-decimal string', async () => {
    const res = await create()
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      success: true,
      error: null,
      data: { name: 'Áo thun', sku: 'AT-001', price: '199000.00', stock: 10, status: 'active' },
    })
    expect(res.body.data.id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('returns 400 with field errors', async () => {
    const res = await create({ name: '', sku: 'X', price: -5 })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
    expect(Object.keys(res.body.error.fields)).toEqual(expect.arrayContaining(['name', 'price']))
  })

  it('returns 409 on duplicate SKU', async () => {
    await create()
    const res = await create()
    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('SKU_EXISTS')
  })
})

describe('GET /api/products/:id', () => {
  it('returns the product', async () => {
    const { body } = await create()
    const res = await request(app).get(`/api/products/${body.data.id}`).set(ADMIN)
    expect(res.status).toBe(200)
    expect(res.body.data.sku).toBe('AT-001')
  })

  it('returns 404 when missing', async () => {
    const res = await request(app).get(`/api/products/${MISSING_ID}`).set(ADMIN)
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })

  it('returns 400 for a non-UUID id', async () => {
    const res = await request(app).get('/api/products/abc').set(ADMIN)
    expect(res.status).toBe(400)
  })
})

describe('GET /api/products', () => {
  beforeEach(async () => {
    await create({ ...sample, name: 'Áo thun', sku: 'AT-001', price: 100, status: 'active' })
    await create({ ...sample, name: 'Quần jean', sku: 'QJ-001', price: 300, status: 'draft' })
    await create({ ...sample, name: 'Mũ lưỡi trai', sku: 'MU-001', price: 200, status: 'active' })
  })

  it('paginates and reports meta', async () => {
    const res = await request(app).get('/api/products?limit=2&page=2').set(ADMIN)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.meta).toEqual({ total: 3, page: 2, limit: 2 })
  })

  it('defaults to newest first', async () => {
    const res = await request(app).get('/api/products').set(ADMIN)
    expect(res.body.data.map((p: { sku: string }) => p.sku)).toEqual(['MU-001', 'QJ-001', 'AT-001'])
  })

  it('filters by status', async () => {
    const res = await request(app).get('/api/products?status=draft').set(ADMIN)
    expect(res.body.data.map((p: { sku: string }) => p.sku)).toEqual(['QJ-001'])
  })

  it('searches by name or sku', async () => {
    const byName = await request(app).get('/api/products?q=jean').set(ADMIN)
    expect(byName.body.meta.total).toBe(1)
    const bySku = await request(app).get('/api/products?q=mu-').set(ADMIN)
    expect(bySku.body.data[0].sku).toBe('MU-001')
  })

  it('sorts by price ascending', async () => {
    const res = await request(app).get('/api/products?sort=price').set(ADMIN)
    expect(res.body.data.map((p: { price: string }) => p.price)).toEqual(['100.00', '200.00', '300.00'])
  })

  it('rejects a sort column outside the whitelist', async () => {
    const res = await request(app).get('/api/products?sort=deleted_at').set(ADMIN)
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/products/:id', () => {
  it('updates only the given fields', async () => {
    const { body } = await create()
    const res = await request(app).patch(`/api/products/${body.data.id}`).set(ADMIN).send({ stock: 3 })
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ stock: 3, name: 'Áo thun', sku: 'AT-001' })
  })

  it('returns 400 for an empty body', async () => {
    const { body } = await create()
    const res = await request(app).patch(`/api/products/${body.data.id}`).set(ADMIN).send({})
    expect(res.status).toBe(400)
  })

  it('returns 404 when missing', async () => {
    const res = await request(app).patch(`/api/products/${MISSING_ID}`).set(ADMIN).send({ stock: 1 })
    expect(res.status).toBe(404)
  })

  it('returns 409 when the new SKU belongs to another product', async () => {
    await create()
    const other = await create({ ...sample, sku: 'AT-002' })
    const res = await request(app).patch(`/api/products/${other.body.data.id}`).set(ADMIN).send({ sku: 'AT-001' })
    expect(res.status).toBe(409)
  })
})

describe('DELETE /api/products/:id', () => {
  it('soft deletes and hides the product', async () => {
    const { body } = await create()
    const del = await request(app).delete(`/api/products/${body.data.id}`).set(ADMIN)
    expect(del.status).toBe(204)
    expect((await request(app).get(`/api/products/${body.data.id}`).set(ADMIN)).status).toBe(404)
    expect((await request(app).get('/api/products').set(ADMIN)).body.meta.total).toBe(0)
  })

  it('frees the SKU for reuse', async () => {
    const { body } = await create()
    await request(app).delete(`/api/products/${body.data.id}`).set(ADMIN)
    expect((await create()).status).toBe(201)
  })

  it('returns 404 when already deleted', async () => {
    const { body } = await create()
    await request(app).delete(`/api/products/${body.data.id}`).set(ADMIN)
    const res = await request(app).delete(`/api/products/${body.data.id}`).set(ADMIN)
    expect(res.status).toBe(404)
  })
})
