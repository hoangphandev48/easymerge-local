import express from 'express'
import { fail } from './envelope.js'
import { requireAdmin, type Authenticate } from './middleware/auth.js'
import { errorHandler } from './middleware/error-handler.js'
import { createRateLimiter, DEFAULT_RATE_LIMIT, type RateLimitOptions } from './middleware/rate-limit.js'
import { createProductRouter } from './modules/products/product.routes.js'
import type { ProductRepository } from './modules/products/product.repository.js'
import { createMemoryAuditRepository, type AuditRepository } from './modules/products/product.audit.js'
import { createProductService } from './modules/products/product.service.js'

export interface AppDeps {
  readonly products: ProductRepository
  readonly authenticate: Authenticate
  readonly audit?: AuditRepository
  readonly rateLimit?: RateLimitOptions
}

export function createApp({
  products,
  authenticate,
  audit = createMemoryAuditRepository(),
  rateLimit = DEFAULT_RATE_LIMIT,
}: AppDeps) {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  // rate-limit → auth → validate → handler (docs/api/implementation.md)
  app.use('/api', createRateLimiter(rateLimit))
  app.use('/api/products', requireAdmin(authenticate), createProductRouter(createProductService(products, audit)))

  app.use((_req, res) => {
    res.status(404).json(fail('NOT_FOUND', 'Không tìm thấy'))
  })
  app.use(errorHandler)
  return app
}
