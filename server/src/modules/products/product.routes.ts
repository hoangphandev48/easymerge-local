import { Router } from 'express'
import { ok } from '../../envelope.js'
import { validate } from '../../middleware/validate.js'
import {
  bulkDeleteSchema,
  createProductSchema,
  idParamSchema,
  listProductsQuerySchema,
  updateProductSchema,
  type BulkDeleteInput,
  type ListProductsQuery,
} from './product.schema.js'
import type { ProductService } from './product.service.js'

export function createProductRouter(service: ProductService) {
  const router = Router()

  router.get('/', validate('query', listProductsQuerySchema), async (_req, res) => {
    const query = res.locals.query as ListProductsQuery
    const { items, total } = await service.list(query)
    res.json(ok(items, { total, page: query.page, limit: query.limit }))
  })

  router.post('/bulk-delete', validate('body', bulkDeleteSchema), async (_req, res) => {
    const { ids } = res.locals.body as BulkDeleteInput
    res.json(ok(await service.bulkRemove(ids)))
  })

  router.get('/:id', validate('params', idParamSchema), async (_req, res) => {
    res.json(ok(await service.get(res.locals.params.id)))
  })

  router.post('/', validate('body', createProductSchema), async (_req, res) => {
    res.status(201).json(ok(await service.create(res.locals.body)))
  })

  router.patch('/:id', validate('params', idParamSchema), validate('body', updateProductSchema), async (_req, res) => {
    res.json(ok(await service.update(res.locals.params.id, res.locals.body)))
  })

  router.delete('/:id', validate('params', idParamSchema), async (_req, res) => {
    await service.remove(res.locals.params.id)
    res.status(204).end()
  })

  return router
}
