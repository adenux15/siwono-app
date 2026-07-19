import { db } from "./src/db/index";
import { users, rooms, racks, albums, archives, loans } from "./src/db/schema";
import crypto from "crypto";

async function seed() {
  console.log("Starting Neon DB seed...");
  try {
    const existingUser = await db.select().from(users).where(require('drizzle-orm').eq(users.email, "admin@siwono.local")).limit(1);
    if (!existingUser.length) {
      throw new Error("User admin@siwono.local not found! Run the app and register it first, or use the one created by better-auth.");
    }
    const userId = existingUser[0].id;
    console.log("Using existing user ID:", userId);

    // 2. Insert Room
    const roomId = "room_yuridis_1";
    await db.insert(rooms).values({
      id: roomId,
      name: "Yuridis Utama",
      type: "yuridis",
      adminId: userId,
      createdAt: new Date(),
    }).onConflictDoNothing();
    console.log("Seeded room.");

    // 3. Insert Rack
    const rackId = "rack_a1";
    await db.insert(racks).values({
      id: rackId,
      roomId: roomId,
      code: "A1",
      rows: 5,
      cols: 4,
      createdAt: new Date(),
    }).onConflictDoNothing();
    console.log("Seeded rack.");

    // 4. Insert Album
    const albumId = "album_a1_1";
    await db.insert(albums).values({
      id: albumId,
      rackId: rackId,
      rowPos: 1,
      colPos: 1,
      code: "ALB-001",
      capacity: 100,
      currentFill: 5,
      createdAt: new Date(),
    }).onConflictDoNothing();
    console.log("Seeded album.");

    // 5. Insert Archives
    const archiveId1 = "arch_1";
    const archiveId2 = "arch_2";
    await db.insert(archives).values([
      {
        id: archiveId1,
        archiveNumber: "TEST-001",
        ownerName: "Budi Santoso",
        status: "Tersedia",
        albumId: albumId,
        regionCode: "REG-01",
        docType: "Sertifikat",
        createdAt: new Date(),
      },
      {
        id: archiveId2,
        archiveNumber: "TEST-002",
        ownerName: "Siti Aminah",
        status: "Dipinjam",
        albumId: albumId,
        regionCode: "REG-02",
        docType: "Sertifikat",
        createdAt: new Date(),
      }
    ]).onConflictDoNothing();
    console.log("Seeded archives.");

    // 6. Insert Loan
    const loanId1 = "loan_1";
    await db.insert(loans).values({
      id: loanId1,
      archiveId: archiveId2,
      initialUserId: userId,
      borrowerName: "Joko",
      notes: "Peminjaman test",
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      status: "Berjalan",
      createdAt: new Date(),
    }).onConflictDoNothing();
    console.log("Seeded loans.");

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
}

seed();
