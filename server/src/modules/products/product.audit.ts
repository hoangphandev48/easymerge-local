import { randomUUID } from 'node:crypto'
import type pg from 'pg'
import type { Product } from './product.types.js'

export type AuditAction = 'create' | 'update' | 'delete'

export interface AuditEntry {
  readonly id: string
  readonly productId: string
  readonly actor: string
  readonly action: AuditAction
  readonly before: Product | null
  readonly after: Product | null
  readonly createdAt: string
}

export type NewAuditEntry = Omit<AuditEntry, 'id' | 'createdAt'>

export interface AuditRepository {
  record(entry: NewAuditEntry): Promise<void>
  list(productId: string, page: number, limit: number): Promise<{ items: AuditEntry[]; total: number }>
  clear(productId: string): Promise<void>
}

export function createMemoryAuditRepository(): AuditRepository {
  let entries: readonly AuditEntry[] = []
  const forProduct = (productId: string) => entries.filter((e) => e.productId === productId)
  return {
    async record(entry) {
      entries = [...entries, { ...entry, id: randomUUID(), createdAt: new Date().toISOString() }]
    },
    async list(productId, page, limit) {
      const all = [...forProduct(productId)].reverse()
      return { items: all.slice((page - 1) * limit, page * limit), total: all.length }
    },
    async clear(productId) {
      entries = entries.filter((e) => e.productId !== productId)
    },
  }
}

interface AuditRow {
  id: string
  product_id: string
  actor: string
  action: AuditAction
  before: Product | null
  after: Product | null
  created_at: Date
}

const toEntry = (row: AuditRow): AuditEntry => ({
  id: row.id,
  productId: row.product_id,
  actor: row.actor,
  action: row.action,
  before: row.before,
  after: row.after,
  createdAt: row.created_at.toISOString(),
})

export function createPgAuditRepository(pool: pg.Pool): AuditRepository {
  return {
    async record(entry) {
      await pool.query(
        'INSERT INTO product_audit_logs (product_id, actor, action, before, after) VALUES ($1, $2, $3, $4, $5)',
        [entry.productId, entry.actor, entry.action, entry.before, entry.after],
      )
    },
    async list(productId, page, limit) {
      const [rows, count] = await Promise.all([
        pool.query<AuditRow>(
          `SELECT id, product_id, actor, action, before, after, created_at FROM product_audit_logs
           WHERE product_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
          [productId, limit, (page - 1) * limit],
        ),
        pool.query<{ total: string }>('SELECT count(*) AS total FROM product_audit_logs WHERE product_id = $1', [productId]),
      ])
      return { items: rows.rows.map(toEntry), total: Number(count.rows[0]?.total ?? 0) }
    },
    async clear(productId) {
      await pool.query('DELETE FROM product_audit_logs WHERE product_id = $1', [productId])
    },
  }
}
