import { db } from "./src/db";
import { loans } from "./src/db/schema";
async function test() {
  const result = await db.select().from(loans);
  console.log(result);
}
test();
