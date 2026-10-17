import { describe, expect, it } from 'vitest'
import {
  createProductSchema,
  listProductsQuerySchema,
  updateProductSchema,
} from '../src/modules/products/product.schema.js'

describe('createProductSchema', () => {
  it('applies defaults and trims name', () => {
    const result = createProductSchema.parse({ name: '  Áo thun ', sku: 'AT-001', price: 199000 })
    expect(result).toEqual({
      name: 'Áo thun',
      sku: 'AT-001',
      description: '',
      price: 199000,
      stock: 0,
      status: 'draft',
    })
  })

  it.each([
    ['empty name', { name: '', sku: 'A', price: 1 }],
    ['name too long', { name: 'x'.repeat(201), sku: 'A', price: 1 }],
    ['negative price', { name: 'A', sku: 'A', price: -1 }],
    ['fractional stock', { name: 'A', sku: 'A', price: 1, stock: 1.5 }],
    ['unknown status', { name: 'A', sku: 'A', price: 1, status: 'gone' }],
    ['missing sku', { name: 'A', price: 1 }],
  ])('rejects %s', (_label, body) => {
    expect(createProductSchema.safeParse(body).success).toBe(false)
  })
})

describe('updateProductSchema', () => {
  it('accepts a partial body', () => {
    expect(updateProductSchema.parse({ stock: 5 })).toEqual({ stock: 5 })
  })

  it('rejects an empty body', () => {
    expect(updateProductSchema.safeParse({}).success).toBe(false)
  })
})

describe('listProductsQuerySchema', () => {
  it('uses defaults', () => {
    expect(listProductsQuerySchema.parse({})).toEqual({ page: 1, limit: 20, sort: '-createdAt' })
  })

  it('coerces numeric strings', () => {
    expect(listProductsQuerySchema.parse({ page: '2', limit: '50' })).toMatchObject({ page: 2, limit: 50 })
  })

  it.each([{ page: '0' }, { limit: '101' }, { sort: 'password' }, { status: 'x' }])(
    'rejects %o',
    (query) => {
      expect(listProductsQuerySchema.safeParse(query).success).toBe(false)
    },
  )
})
