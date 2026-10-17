import { z } from 'zod'
import { PRODUCT_STATUSES } from './product.types.js'

export const SORT_OPTIONS = [
  'createdAt', '-createdAt', 'name', '-name', 'price', '-price', 'stock', '-stock',
] as const

const productFields = z.object({
  name: z.string().trim().min(1).max(200),
  sku: z.string().trim().min(1).max(50),
  description: z.string().max(5000),
  price: z.number().min(0).max(9_999_999_999.99),
  stock: z.number().int().min(0),
  status: z.enum(PRODUCT_STATUSES),
})

export const createProductSchema = productFields.extend({
  description: productFields.shape.description.default(''),
  stock: productFields.shape.stock.default(0),
  status: productFields.shape.status.default('draft'),
})

// Built from the default-free fields so a PATCH never overwrites omitted fields.
export const updateProductSchema = productFields
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'Cần ít nhất một trường')

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().min(1).optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  sort: z.enum(SORT_OPTIONS).default('-createdAt'),
})

export const BULK_DELETE_MAX_IDS = 500

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(BULK_DELETE_MAX_IDS),
})

export const idParamSchema = z.object({ id: z.string().uuid() })

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>
