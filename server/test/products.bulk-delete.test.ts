import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'
import { createMemoryProductRepository } from './memory-product-repository.js'

const ADMIN = { Authorization: 'Bearer admin' }
const MISSING_ID = '00000000-0000-4000-8000-000000000000'

const authenticate = (req: { header(name: string): string | undefined }) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  return token ? { role: token } : null
}

let app: ReturnType<typeof createApp>

beforeEach(() => {
  app = createApp({ products: createMemoryProductRepository(), authenticate })
})

const create = async (sku: string) =>
  (await request(app).post('/api/products').set(ADMIN).send({ name: sku, sku, price: 1000 })).body.data.id as string

const bulkDelete = (ids: string[]) => request(app).post('/api/products/bulk-delete').set(ADMIN).send({ ids })

describe('POST /api/products/bulk-delete', () => {
  it('removes the given products', async () => {
    const [a, b, keep] = [await create('A'), await create('B'), await create('C')]
    const res = await bulkDelete([a, b])
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual({ deleted: 2 })

    const list = await request(app).get('/api/products').set(ADMIN)
    expect(list.body.data.map((p: { id: string }) => p.id)).toEqual([keep])
  })

  it('counts duplicated ids once', async () => {
    const a = await create('A')
    const res = await bulkDelete([a, a])
    expect(res.body.data).toEqual({ deleted: 1 })
  })

  it('rejects an unknown id', async () => {
    const res = await bulkDelete([MISSING_ID])
    expect(res.status).toBe(404)
  })

  it('rejects malformed ids and empty lists', async () => {
    expect((await bulkDelete(['nope'])).status).toBe(400)
    expect((await bulkDelete([])).status).toBe(400)
  })
})
