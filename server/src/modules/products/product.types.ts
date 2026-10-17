export const PRODUCT_STATUSES = ['draft', 'active', 'archived'] as const
export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

export interface Product {
  readonly id: string
  readonly name: string
  readonly sku: string
  readonly description: string
  /** Decimal string with 2 fraction digits, e.g. "199000.00". */
  readonly price: string
  readonly stock: number
  readonly status: ProductStatus
  readonly createdAt: string
  readonly updatedAt: string
}
