import { randomUUID } from 'node:crypto'
import type pg from 'pg'

export type AuditAction = 'create' | 'update' | 'delete'

export interface AuditEntry {
  readonly id: string
  readonly productId: string
  readonly actor: string
  readonly action: AuditAction
  readonly before: Record<string, unknown> | null
  readonly after: Record<string, unknown> | null
  readonly createdAt: string
}

export interface AuditRepository {
  /** Newest first. Returns an empty page when the product has no history. */
  list(productId: string, page: number, limit: number): Promise<{ items: AuditEntry[]; total: number }>
}

interface AuditRow {
  id: string
  product_id: string
  actor: string
  action: AuditAction
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
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
    async list(productId, page, limit) {
      const [rows, count] = await Promise.all([
        pool.query<AuditRow>(
          `SELECT id, product_id, actor, action, before, after, created_at FROM product_audit_logs
           WHERE product_id = $1 ORDER BY created_at DESC, id LIMIT $2 OFFSET $3`,
          [productId, limit, (page - 1) * limit],
        ),
        pool.query<{ total: string }>('SELECT count(*) AS total FROM product_audit_logs WHERE product_id = $1', [productId]),
      ])
      return { items: rows.rows.map(toEntry), total: Number(count.rows[0]?.total ?? 0) }
    },
  }
}

export function createMemoryAuditRepository(seed: readonly AuditEntry[] = []): AuditRepository {
  return {
    async list(productId, page, limit) {
      const all = seed.filter((e) => e.productId === productId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      return { items: all.slice((page - 1) * limit, page * limit), total: all.length }
    },
  }
}
