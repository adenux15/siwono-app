import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/db/schema';
import * as dotenv from 'dotenv';
import { auth } from "./src/lib/auth";
import { eq } from 'drizzle-orm';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function run() {
  try {
    // 1. Rename old emails to free them up
    await db.update(schema.users).set({ email: 'admin_old@siwono.local' }).where(eq(schema.users.email, 'admin@siwono.local'));
    await db.update(schema.users).set({ email: 'petugas_old@siwono.local' }).where(eq(schema.users.email, 'petugas@siwono.local'));

    // 2. Create new users using better-auth
    const adminReq = await auth.api.signUpEmail({
      body: {
        email: "admin@siwono.local",
        password: "password123",
        name: "Admin Pusat",
      }
    });
    console.log("Admin created via better-auth");

    const petugasReq = await auth.api.signUpEmail({
      body: {
        email: "petugas@siwono.local",
        password: "password123",
        name: "Petugas Arsip",
      }
    });
    console.log("Petugas created via better-auth");

    // 3. Update roles for the new users (better-auth defaults to 'user' or null)
    if (adminReq?.user?.id) {
        await db.update(schema.users).set({ role: 'admin' }).where(eq(schema.users.id, adminReq.user.id));
    }
    if (petugasReq?.user?.id) {
        await db.update(schema.users).set({ role: 'petugas' }).where(eq(schema.users.id, petugasReq.user.id));
    }

    console.log("Users setup complete!");
  } catch (err) {
    console.error("Failed to setup users", err);
  }
}

run();
