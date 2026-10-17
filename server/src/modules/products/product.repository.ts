import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from './product.schema.js'
import type { Product } from './product.types.js'

export interface ProductRepository {
  list(query: ListProductsQuery): Promise<{ items: Product[]; total: number }>
  findById(id: string): Promise<Product | null>
  /** Throws AppError(409, SKU_EXISTS) when the SKU is taken by a live product. */
  create(input: CreateProductInput): Promise<Product>
  /** Returns null when the product does not exist or is deleted. */
  update(id: string, patch: UpdateProductInput): Promise<Product | null>
  /** Returns false when the product does not exist or is already deleted. */
  softDelete(id: string): Promise<boolean>
}
