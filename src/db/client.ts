import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2/promise'

export type Database = ReturnType<typeof drizzle>

let db: Database | null = null

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL)
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for MySQL persistence.')
  }

  if (!db) {
    const pool = createPool(process.env.DATABASE_URL)
    db = drizzle({ client: pool })
  }

  return db
}
