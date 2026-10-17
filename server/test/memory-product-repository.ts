import { randomUUID } from 'node:crypto'
import { AppError } from '../src/errors.js'
import type { ProductRepository } from '../src/modules/products/product.repository.js'
import type { ListProductsQuery } from '../src/modules/products/product.schema.js'
import type { Product } from '../src/modules/products/product.types.js'

type Row = Product & { deletedAt: string | null }

/** In-memory test double that mirrors the DB rules (soft delete, unique SKU among live rows). */
export function createMemoryProductRepository(): ProductRepository {
  let rows: readonly Row[] = []

  const live = () => rows.filter((r) => r.deletedAt === null)
  const toProduct = ({ deletedAt: _deletedAt, ...product }: Row): Product => product
  const assertSkuFree = (sku: string, exceptId?: string) => {
    if (live().some((r) => r.sku === sku && r.id !== exceptId)) {
      throw new AppError(409, 'SKU_EXISTS', 'SKU đã tồn tại')
    }
  }

  return {
    async list(query: ListProductsQuery) {
      const q = query.q?.toLowerCase()
      const filtered = live()
        .filter((r) => !query.status || r.status === query.status)
        .filter((r) => !q || r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q))
      const desc = query.sort.startsWith('-')
      const key = query.sort.replace('-', '') as 'createdAt' | 'name' | 'price' | 'stock'
      const sorted = [...filtered].sort((a, b) => {
        const av = key === 'price' ? Number(a.price) : a[key]
        const bv = key === 'price' ? Number(b.price) : b[key]
        return (av < bv ? -1 : av > bv ? 1 : 0) * (desc ? -1 : 1)
      })
      const start = (query.page - 1) * query.limit
      return { items: sorted.slice(start, start + query.limit).map(toProduct), total: sorted.length }
    },

    async findById(id) {
      const row = live().find((r) => r.id === id)
      return row ? toProduct(row) : null
    },

    async create(input) {
      assertSkuFree(input.sku)
      const now = new Date(Date.now() + rows.length).toISOString()
      const row: Row = {
        ...input,
        price: input.price.toFixed(2),
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      }
      rows = [...rows, row]
      return toProduct(row)
    },

    async update(id, patch) {
      const current = live().find((r) => r.id === id)
      if (!current) return null
      if (patch.sku !== undefined) assertSkuFree(patch.sku, id)
      const next: Row = {
        ...current,
        ...patch,
        price: patch.price !== undefined ? patch.price.toFixed(2) : current.price,
        updatedAt: new Date().toISOString(),
      }
      rows = rows.map((r) => (r.id === id ? next : r))
      return toProduct(next)
    },

    async softDelete(id) {
      if (!live().some((r) => r.id === id)) return false
      rows = rows.map((r) => (r.id === id ? { ...r, deletedAt: new Date().toISOString() } : r))
      return true
    },

    async bulkDelete(ids) {
      const removed = live().filter((r) => ids.includes(r.id)).map((r) => r.id)
      rows = rows.filter((r) => !removed.includes(r.id))
      return removed
    },
  }
}
