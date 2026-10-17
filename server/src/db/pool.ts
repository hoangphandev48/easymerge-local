import pg from 'pg'

export function createPool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error('DATABASE_URL is required')
  const pool = new pg.Pool({ connectionString })
  // Idle clients can error (e.g. server restart); without a listener Node would crash.
  pool.on('error', (err) => console.error('Idle Postgres client error', err))
  return pool
}
