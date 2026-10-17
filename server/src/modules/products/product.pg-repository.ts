import type pg from 'pg'
import { AppError } from '../../errors.js'
import type { ProductRepository } from './product.repository.js'
import type { ListProductsQuery, UpdateProductInput } from './product.schema.js'
import type { Product } from './product.types.js'

const UNIQUE_VIOLATION = '23505'

const SORT_COLUMNS = {
  createdAt: 'created_at',
  name: 'name',
  price: 'price',
  stock: 'stock',
} as const

const UPDATABLE_COLUMNS = {
  name: 'name',
  sku: 'sku',
  description: 'description',
  price: 'price',
  stock: 'stock',
  status: 'status',
} as const

const COLUMNS = 'id, name, sku, description, price, stock, status, created_at, updated_at'

interface ProductRow {
  id: string
  name: string
  sku: string
  description: string
  price: string
  stock: number
  status: Product['status']
  created_at: Date
  updated_at: Date
}

const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  sku: row.sku,
  description: row.description,
  price: row.price,
  stock: row.stock,
  status: row.status,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
})

const escapeLike = (value: string) => value.replace(/[\\%_]/g, '\\$&')

const mapDbError = (err: unknown): never => {
  if ((err as { code?: string }).code === UNIQUE_VIOLATION) {
    throw new AppError(409, 'SKU_EXISTS', 'SKU đã tồn tại', { sku: 'SKU đã tồn tại' })
  }
  throw err
}

function buildListFilter(query: ListProductsQuery) {
  const clauses = ['deleted_at IS NULL']
  const params: unknown[] = []
  if (query.status) {
    params.push(query.status)
    clauses.push(`status = $${params.length}`)
  }
  if (query.q) {
    params.push(`%${escapeLike(query.q)}%`)
    clauses.push(`(name ILIKE $${params.length} OR sku ILIKE $${params.length})`)
  }
  return { where: clauses.join(' AND '), params }
}

export function createPgProductRepository(pool: pg.Pool): ProductRepository {
  return {
    async list(query) {
      const { where, params } = buildListFilter(query)
      const direction = query.sort.startsWith('-') ? 'DESC' : 'ASC'
      const column = SORT_COLUMNS[query.sort.replace('-', '') as keyof typeof SORT_COLUMNS]
      const offset = (query.page - 1) * query.limit

      const [rows, count] = await Promise.all([
        pool.query<ProductRow>(
          `SELECT ${COLUMNS} FROM products WHERE ${where}
           ORDER BY ${column} ${direction}, id
           LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
          [...params, query.limit, offset],
        ),
        pool.query<{ total: string }>(`SELECT count(*) AS total FROM products WHERE ${where}`, params),
      ])
      return { items: rows.rows.map(toProduct), total: Number(count.rows[0]?.total ?? 0) }
    },

    async findById(id) {
      const { rows } = await pool.query<ProductRow>(
        `SELECT ${COLUMNS} FROM products WHERE id = $1 AND deleted_at IS NULL`,
        [id],
      )
      return rows[0] ? toProduct(rows[0]) : null
    },

    async create(input) {
      try {
        const { rows } = await pool.query<ProductRow>(
          `INSERT INTO products (name, sku, description, price, stock, status)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${COLUMNS}`,
          [input.name, input.sku, input.description, input.price, input.stock, input.status],
        )
        return toProduct(rows[0] as ProductRow)
      } catch (err) {
        return mapDbError(err)
      }
    },

    async update(id, patch: UpdateProductInput) {
      const assignments: string[] = []
      const params: unknown[] = []
      for (const [key, column] of Object.entries(UPDATABLE_COLUMNS)) {
        const value = patch[key as keyof UpdateProductInput]
        if (value === undefined) continue
        params.push(value)
        assignments.push(`${column} = $${params.length}`)
      }
      params.push(id)
      try {
        const { rows } = await pool.query<ProductRow>(
          `UPDATE products SET ${[...assignments, 'updated_at = now()'].join(', ')}
           WHERE id = $${params.length} AND deleted_at IS NULL RETURNING ${COLUMNS}`,
          params,
        )
        return rows[0] ? toProduct(rows[0]) : null
      } catch (err) {
        return mapDbError(err)
      }
    },

    async softDelete(id) {
      const { rowCount } = await pool.query(
        'UPDATE products SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL',
        [id],
      )
      return (rowCount ?? 0) > 0
    },
  }
}
