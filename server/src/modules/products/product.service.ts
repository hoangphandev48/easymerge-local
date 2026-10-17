import { notFound } from '../../errors.js'
import type { AuditRepository } from './product.audit.js'
import type { ProductRepository } from './product.repository.js'
import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from './product.schema.js'

export function createProductService(repo: ProductRepository, audit: AuditRepository) {
  return {
    list: (query: ListProductsQuery) => repo.list(query),

    async get(id: string) {
      const product = await repo.findById(id)
      if (!product) throw notFound('Sản phẩm không tồn tại')
      return product
    },

    async create(input: CreateProductInput, actor: string) {
      const product = await repo.create(input)
      await audit.record({ productId: product.id, actor, action: 'create', before: null, after: product })
      return product
    },

    async update(id: string, patch: UpdateProductInput, actor: string) {
      const before = await repo.findById(id)
      const product = await repo.update(id, patch)
      if (!before || !product) throw notFound('Sản phẩm không tồn tại')
      await audit.record({ productId: id, actor, action: 'update', before, after: product })
      return product
    },

    async remove(id: string) {
      if (!(await repo.softDelete(id))) throw notFound('Sản phẩm không tồn tại')
    },

    async history(id: string, page: number, limit: number) {
      const result = await audit.list(id, page, limit)
      if (result.total === 0) throw notFound('Chưa có lịch sử thay đổi')
      return result
    },

    clearHistory: (id: string) => audit.clear(id),
  }
}

export type ProductService = ReturnType<typeof createProductService>
