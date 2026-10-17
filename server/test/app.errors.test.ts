import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from '../src/app.js'
import { createMemoryProductRepository } from './memory-product-repository.js'

const authenticate = () => ({ role: 'admin' })

describe('error handling', () => {
  it('returns 400 for malformed JSON', async () => {
    const app = createApp({ products: createMemoryProductRepository(), authenticate })
    const res = await request(app)
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send('{bad')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns an envelope 404 for unknown routes', async () => {
    const app = createApp({ products: createMemoryProductRepository(), authenticate })
    const res = await request(app).get('/nope')
    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({ success: false, error: { code: 'NOT_FOUND' } })
  })

  it('hides internal error details behind a generic 500', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const broken = { ...createMemoryProductRepository(), list: async () => { throw new Error('relation "products" does not exist') } }
    const res = await request(createApp({ products: broken, authenticate })).get('/api/products')
    expect(res.status).toBe(500)
    expect(res.body.error.code).toBe('INTERNAL_ERROR')
    expect(JSON.stringify(res.body)).not.toContain('relation')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('payload and rate limits', () => {
  it('returns 413 for an oversized body instead of 500', async () => {
    const app = createApp({ products: createMemoryProductRepository(), authenticate })
    const res = await request(app).post('/api/products').send({ description: 'x'.repeat(200_000) })
    expect(res.status).toBe(413)
    expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE')
  })

  it('returns 429 RATE_LIMITED once the limit is exceeded', async () => {
    const app = createApp({
      products: createMemoryProductRepository(),
      authenticate,
      rateLimit: { windowMs: 60_000, max: 2 },
    })
    await request(app).get('/api/products')
    await request(app).get('/api/products')
    const res = await request(app).get('/api/products')
    expect(res.status).toBe(429)
    expect(res.body).toMatchObject({ success: false, error: { code: 'RATE_LIMITED' } })
  })
})
