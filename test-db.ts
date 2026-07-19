import { db } from "./src/db";
import { archives, users } from "./src/db/schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function check() {
  const allArchives = await db.select().from(archives);
  console.log("Archives:", allArchives);
  const allUsers = await db.select().from(users);
  console.log("Users:", allUsers.map(u => u.email));
  process.exit(0);
}

check();
