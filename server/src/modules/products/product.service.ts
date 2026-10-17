import { notFound } from '../../errors.js'
import type { ProductRepository } from './product.repository.js'
import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from './product.schema.js'

export function createProductService(repo: ProductRepository) {
  return {
    list: (query: ListProductsQuery) => repo.list(query),

    async get(id: string) {
      const product = await repo.findById(id)
      if (!product) throw notFound('Sản phẩm không tồn tại')
      return product
    },

    create: (input: CreateProductInput) => repo.create(input),

    async update(id: string, patch: UpdateProductInput) {
      const product = await repo.update(id, patch)
      if (!product) throw notFound('Sản phẩm không tồn tại')
      return product
    },

    async remove(id: string) {
      if (!(await repo.softDelete(id))) throw notFound('Sản phẩm không tồn tại')
    },

    async bulkRemove(ids: readonly string[]) {
      const unique = [...new Set(ids)]
      const deleted = await repo.bulkDelete(unique)
      if (deleted.length !== unique.length) throw notFound('Một số sản phẩm không tồn tại')
      return { deleted: deleted.length }
    },
  }
}

export type ProductService = ReturnType<typeof createProductService>
