"use server";

import { db } from "@/db";
import { archives, loans, racks, rooms, albums } from "@/db/schema";
import { eq, count, and, gte, lt, ne } from "drizzle-orm";

export async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Summary counts
  const totalArchivesResult = await db.select({ value: count() }).from(archives);
  const totalArchives = totalArchivesResult[0].value;

  const availableArchivesResult = await db
    .select({ value: count() })
    .from(archives)
    .where(eq(archives.status, "Tersedia"));
  const availableArchives = availableArchivesResult[0].value;

  const borrowedArchivesResult = await db
    .select({ value: count() })
    .from(archives)
    .where(eq(archives.status, "Dipinjam"));
  const currentlyBorrowed = borrowedArchivesResult[0].value;

  const addedThisMonthResult = await db
    .select({ value: count() })
    .from(archives)
    .where(gte(archives.createdAt, startOfMonth));
  const addedThisMonth = addedThisMonthResult[0].value;

  // Late returns (dueDate < now and status != Selesai)
  const lateReturnsResult = await db
    .select({ value: count() })
    .from(loans)
    .where(and(lt(loans.dueDate, now), ne(loans.status, "Selesai")));
  const lateReturns = lateReturnsResult[0].value;

  const availabilityPercentage = totalArchives > 0 
    ? Number(((availableArchives / totalArchives) * 100).toFixed(1))
    : 0;

  // Racks data
  // Fetch all rooms, racks, and albums to calculate fill percentage
  const allRooms = await db.select().from(rooms);
  const allRacks = await db.select().from(racks);
  const allAlbums = await db.select().from(albums);

  const yuridisShelves: any[] = [];
  const fisikShelves: any[] = [];

  for (const rack of allRacks) {
    const room = allRooms.find(r => r.id === rack.roomId);
    if (!room) continue;

    const rackAlbums = allAlbums.filter(a => a.rackId === rack.id);
    const totalCapacity = rackAlbums.reduce((sum, a) => sum + a.capacity, 0);
    const totalFill = rackAlbums.reduce((sum, a) => sum + a.currentFill, 0);

    const fillPercentage = totalCapacity > 0 
      ? Math.round((totalFill / totalCapacity) * 100) 
      : 0;

    const shelfData = {
      id: rack.code, // Use code as display ID
      name: rack.code,
      fill: fillPercentage,
      capacity: totalCapacity,
    };

    if (room.type === 'yuridis') {
      yuridisShelves.push(shelfData);
    } else if (room.type === 'fisik') {
      fisikShelves.push(shelfData);
    }
  }

  // Ensure there's at least dummy data if no racks exist so the UI doesn't break
  if (yuridisShelves.length === 0) {
    yuridisShelves.push({ id: 'N/A', name: 'Belum Ada Rak', fill: 0, capacity: 0 });
  }
  if (fisikShelves.length === 0) {
    fisikShelves.push({ id: 'N/A', name: 'Belum Ada Rak', fill: 0, capacity: 0 });
  }

  return {
    summary: {
      totalArchives,
      availableArchives,
      currentlyBorrowed,
      addedThisMonth,
      lateReturns,
      availabilityPercentage,
    },
    shelves: {
      yuridis: yuridisShelves,
      fisik1: fisikShelves,
    }
  };
}
