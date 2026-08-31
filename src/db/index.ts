import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/*
 * Supabase Postgres via Drizzle (postgres.js driver).
 *
 * Same setup as the dashboard: use Supabase's *pooled* connection string (the Transaction
 * pooler on port 6543) so serverless invocations don't exhaust direct connections, and
 * `prepare: false` because that pooler does not support prepared statements.
 *
 * The client is built lazily on first query and cached on globalThis, so `next build`
 * never needs a database and dev HMR reuses one connection instead of leaking a new one
 * per reload.
 */
const globalForDb = globalThis as unknown as {
  _sql?: ReturnType<typeof postgres>;
  _db?: PostgresJsDatabase<typeof schema>;
};

function getDb(): PostgresJsDatabase<typeof schema> {
  if (globalForDb._db) return globalForDb._db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }
  globalForDb._sql ??= postgres(connectionString, { prepare: false, max: 1 });
  globalForDb._db = drizzle(globalForDb._sql, { schema });
  return globalForDb._db;
}

/** Lazy Drizzle client — connects on first use. */
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export { schema };
