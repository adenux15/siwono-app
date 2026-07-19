import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, rooms, racks, albums, archives } from './schema';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Memulai proses seeding database...');

  try {
    const now = new Date();

    // 1. Fetch Users
    console.log('Mendapatkan data user...');
    const adminUser = await db.query.users.findFirst({
        where: eq(users.email, 'admin@siwono.local')
    });
    const petugasUser = await db.query.users.findFirst({
        where: eq(users.email, 'petugas@siwono.local')
    });

    if (!adminUser) {
        throw new Error("Admin user belum dibuat. Jalankan setup-auth.ts terlebih dahulu.");
    }
    const adminId = adminUser.id;

    // 2. Seed Rooms
    console.log('Mengisi tabel rooms...');
    await db.insert(rooms).values([
      { id: 'rm_1', name: 'Ruang Arsip Yuridis', type: 'yuridis', adminId: adminId, createdAt: now },
      { id: 'rm_2', name: 'Ruang Arsip Fisik', type: 'fisik', adminId: adminId, createdAt: now },
    ]).onConflictDoNothing();

    // 3. Seed Racks
    console.log('Mengisi tabel racks...');
    await db.insert(racks).values([
      { id: 'rk_1', roomId: 'rm_1', code: 'RK-Y-01', rows: 5, cols: 4, createdAt: now },
      { id: 'rk_2', roomId: 'rm_1', code: 'RK-Y-02', rows: 5, cols: 4, createdAt: now },
      { id: 'rk_3', roomId: 'rm_2', code: 'RK-F-01', rows: 4, cols: 5, createdAt: now },
    ]).onConflictDoNothing();

    // 4. Seed Albums
    console.log('Mengisi tabel albums...');
    await db.insert(albums).values([
      { id: 'alb_1', rackId: 'rk_1', code: 'ALB-Y-01-A', rowPos: 1, colPos: 1, capacity: 50, currentFill: 2, createdAt: now },
      { id: 'alb_2', rackId: 'rk_1', code: 'ALB-Y-01-B', rowPos: 1, colPos: 2, capacity: 50, currentFill: 1, createdAt: now },
      { id: 'alb_3', rackId: 'rk_3', code: 'ALB-F-01-A', rowPos: 1, colPos: 1, capacity: 100, currentFill: 1, createdAt: now },
    ]).onConflictDoNothing();

    // 5. Seed Archives
    console.log('Mengisi tabel archives...');
    await db.insert(archives).values([
      { id: 'arc_1', archiveNumber: '1234/2026', ownerName: 'Budi Santoso', regionCode: '33.74.1', docType: 'Warkah', albumId: 'alb_1', status: 'Tersedia', createdAt: now },
      { id: 'arc_2', archiveNumber: '1235/2026', ownerName: 'Siti Aminah', regionCode: '33.74.1', docType: 'Warkah', albumId: 'alb_1', status: 'Dipinjam', createdAt: now },
      { id: 'arc_3', archiveNumber: 'BT-9912/2025', ownerName: 'PT Maju Jaya', regionCode: '33.74.2', docType: 'BT', albumId: 'alb_2', status: 'Tersedia', createdAt: now },
      { id: 'arc_4', archiveNumber: 'SU-455/2024', ownerName: 'Agus Setiawan', regionCode: '33.74.3', docType: 'SU', albumId: 'alb_3', status: 'Tersedia', createdAt: now },
    ]).onConflictDoNothing();

    console.log('✅ Seeding database berhasil!');
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat seeding:', error);
  }
}

seed();
