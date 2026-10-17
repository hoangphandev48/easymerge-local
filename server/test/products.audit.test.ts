import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'
import { createMemoryProductRepository } from './memory-product-repository.js'

const ADMIN = { Authorization: 'Bearer admin' }

const authenticate = (req: { header(name: string): string | undefined }) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  return token ? { role: token } : null
}

let app: ReturnType<typeof createApp>

beforeEach(() => {
  app = createApp({ products: createMemoryProductRepository(), authenticate })
})

const create = async () =>
  (await request(app).post('/api/products').set({ ...ADMIN, 'X-Actor': 'linh' }).send({ name: 'A', sku: 'A', price: 1000 })).body
    .data.id as string

describe('product audit log', () => {
  it('records create and update with the acting user', async () => {
    const id = await create()
    await request(app).patch(`/api/products/${id}`).set({ ...ADMIN, 'X-Actor': 'minh' }).send({ price: 1500 })

    const res = await request(app).get(`/api/products/${id}/audit`).set(ADMIN)
    expect(res.status).toBe(200)
    expect(res.body.meta).toMatchObject({ total: 2, page: 1, limit: 20 })
    expect(res.body.data.map((e: { action: string; actor: string }) => [e.action, e.actor])).toEqual([
      ['update', 'minh'],
      ['create', 'linh'],
    ])
    expect(res.body.data[0].before.price).toBe('1000.00')
    expect(res.body.data[0].after.price).toBe('1500.00')
  })

  it('returns 404 when the product has no history', async () => {
    const res = await request(app).get('/api/products/00000000-0000-4000-8000-000000000000/audit').set(ADMIN)
    expect(res.status).toBe(404)
  })

  it('lets an admin clear the history', async () => {
    const id = await create()
    expect((await request(app).delete(`/api/products/${id}/audit`).set(ADMIN)).status).toBe(204)
    expect((await request(app).get(`/api/products/${id}/audit`).set(ADMIN)).status).toBe(404)
  })
})
