import type { Product } from './product.types.js'

const HEADER = ['id', 'name', 'sku', 'description', 'price', 'stock', 'status', 'createdAt'] as const

const quote = (value: string) => (/[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value)

export function toCsv(products: readonly Product[]): string {
  const lines = products.map((p) =>
    [p.id, p.name, p.sku, p.description, p.price, String(p.stock), p.status, p.createdAt].map(quote).join(','),
  )
  return [HEADER.join(','), ...lines].join('\r\n') + '\r\n'
}
