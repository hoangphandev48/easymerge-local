import { notFound } from '../../errors.js'
import type { ProductRepository } from './product.repository.js'
import { toCsv } from './product.csv.js'
import type { CreateProductInput, ExportProductsQuery, ListProductsQuery, UpdateProductInput } from './product.schema.js'

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

    async exportCsv(query: ExportProductsQuery) {
      return toCsv(await repo.listForExport(query))
    },
  }
}

export type ProductService = ReturnType<typeof createProductService>
