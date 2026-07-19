import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString, { 
  prepare: false,
  max: 1,
  ssl: 'require',
  connect_timeout: 10,
});
export const db = drizzle(client, { schema });
