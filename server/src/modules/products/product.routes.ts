import { Router, type Request } from 'express'
import { ok } from '../../envelope.js'
import { validate } from '../../middleware/validate.js'
import {
  auditQuerySchema,
  createProductSchema,
  idParamSchema,
  listProductsQuerySchema,
  updateProductSchema,
  type AuditQuery,
  type ListProductsQuery,
} from './product.schema.js'
import type { ProductService } from './product.service.js'

const actorOf = (req: Request) => req.header('X-Actor') ?? 'system'

export function createProductRouter(service: ProductService) {
  const router = Router()

  router.get('/', validate('query', listProductsQuerySchema), async (_req, res) => {
    const query = res.locals.query as ListProductsQuery
    const { items, total } = await service.list(query)
    res.json(ok(items, { total, page: query.page, limit: query.limit }))
  })

  router.get('/:id', validate('params', idParamSchema), async (_req, res) => {
    res.json(ok(await service.get(res.locals.params.id)))
  })

  router.post('/', validate('body', createProductSchema), async (req, res) => {
    res.status(201).json(ok(await service.create(res.locals.body, actorOf(req))))
  })

  router.patch('/:id', validate('params', idParamSchema), validate('body', updateProductSchema), async (req, res) => {
    res.json(ok(await service.update(res.locals.params.id, res.locals.body, actorOf(req))))
  })

  router.get('/:id/audit', validate('params', idParamSchema), validate('query', auditQuerySchema), async (_req, res) => {
    const { page, limit } = res.locals.query as AuditQuery
    const { items, total } = await service.history(res.locals.params.id, page, limit)
    res.json(ok(items, { total, page, limit }))
  })

  router.delete('/:id/audit', validate('params', idParamSchema), async (_req, res) => {
    await service.clearHistory(res.locals.params.id)
    res.status(204).end()
  })

  router.delete('/:id', validate('params', idParamSchema), async (_req, res) => {
    await service.remove(res.locals.params.id)
    res.status(204).end()
  })

  return router
}
