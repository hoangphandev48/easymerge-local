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

const create = (body: object) => request(app).post('/api/products').set(ADMIN).send(body)

describe('GET /api/products/export.csv', () => {
  it('exports products as CSV with a header row', async () => {
    await create({ name: 'Áo thun', sku: 'AT-001', price: 199000, stock: 10, status: 'active' })
    const res = await request(app).get('/api/products/export.csv').set(ADMIN)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/csv')
    expect(res.headers['content-disposition']).toContain('products.csv')
    const [header, row] = res.text.split('\r\n')
    expect(header).toBe('id,name,sku,description,price,stock,status,createdAt')
    expect(row).toContain('Áo thun,AT-001,,199000.00,10,active')
  })

  it('quotes fields containing commas and quotes', async () => {
    await create({ name: 'Áo "đẹp", dài', sku: 'AT-002', price: 1 })
    const res = await request(app).get('/api/products/export.csv').set(ADMIN)
    expect(res.text).toContain('"Áo ""đẹp"", dài"')
  })

  it('filters by status', async () => {
    await create({ name: 'A', sku: 'A', price: 1, status: 'active' })
    await create({ name: 'B', sku: 'B', price: 1, status: 'draft' })
    const res = await request(app).get('/api/products/export.csv?status=draft').set(ADMIN)
    expect(res.text.trim().split('\r\n')).toHaveLength(2)
  })
})
