import { readFileSync } from 'node:fs'
import pg from 'pg'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createPgProductRepository } from '../src/modules/products/product.pg-repository.js'

const url = process.env.TEST_DATABASE_URL

// Runs only when TEST_DATABASE_URL points at a disposable Postgres database.
describe.skipIf(!url)('pg product repository', () => {
  let pool: pg.Pool
  const repo = () => createPgProductRepository(pool)
  const input = { name: 'Áo thun', sku: 'AT-001', description: '', price: 199000, stock: 10, status: 'active' as const }
  const listAll = { page: 1, limit: 20, sort: '-createdAt' as const }

  beforeAll(async () => {
    pool = new pg.Pool({ connectionString: url })
    await pool.query('DROP TABLE IF EXISTS products')
    await pool.query(readFileSync('migrations/001_create_products.sql', 'utf8'))
  })
  beforeEach(() => pool.query('TRUNCATE products'))
  afterAll(() => pool.end())

  it('creates and reads back with a 2-decimal price string', async () => {
    const created = await repo().create(input)
    expect(created.price).toBe('199000.00')
    expect(await repo().findById(created.id)).toEqual(created)
  })

  it('maps duplicate SKU to SKU_EXISTS and allows reuse after delete', async () => {
    const first = await repo().create(input)
    await expect(repo().create(input)).rejects.toMatchObject({ status: 409, code: 'SKU_EXISTS' })
    await repo().softDelete(first.id)
    await expect(repo().create(input)).resolves.toBeDefined()
  })

  it('updates only provided columns and bumps updatedAt', async () => {
    const created = await repo().create(input)
    const updated = await repo().update(created.id, { stock: 3 })
    expect(updated).toMatchObject({ stock: 3, name: 'Áo thun', status: 'active' })
    expect(updated!.updatedAt >= created.updatedAt).toBe(true)
  })

  it('returns null / false for missing or deleted rows', async () => {
    const created = await repo().create(input)
    await repo().softDelete(created.id)
    expect(await repo().findById(created.id)).toBeNull()
    expect(await repo().update(created.id, { stock: 1 })).toBeNull()
    expect(await repo().softDelete(created.id)).toBe(false)
  })

  it('filters, searches (escaping LIKE wildcards), sorts and paginates', async () => {
    await repo().create({ ...input, name: 'Quần 100%', sku: 'Q-1', price: 300, status: 'draft' })
    await repo().create({ ...input, name: 'Áo', sku: 'A-1', price: 100 })
    await repo().create({ ...input, name: 'Mũ', sku: 'M-1', price: 200 })

    const byPrice = await repo().list({ ...listAll, sort: 'price' })
    expect(byPrice.items.map((p) => p.sku)).toEqual(['A-1', 'M-1', 'Q-1'])
    expect(byPrice.total).toBe(3)

    expect((await repo().list({ ...listAll, status: 'draft' })).total).toBe(1)
    expect((await repo().list({ ...listAll, q: '%' })).items.map((p) => p.sku)).toEqual(['Q-1'])
    expect((await repo().list({ ...listAll, q: 'm-1' })).total).toBe(1)

    const page2 = await repo().list({ ...listAll, sort: 'price', limit: 2, page: 2 })
    expect(page2.items.map((p) => p.sku)).toEqual(['Q-1'])
  })
})
