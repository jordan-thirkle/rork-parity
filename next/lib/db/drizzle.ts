import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

function createClient() {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    // No DB configured (e.g. UI preview before secrets are set).
    // The client is created but queries will fail at runtime; callers
    // should handle connection errors so the rest of the app keeps working.
    return postgres('postgres://localhost:5432/rorkparity_offline');
  }
  return postgres(url, { prepare: false });
}

export const client = createClient();
export const db = drizzle(client, { schema });
