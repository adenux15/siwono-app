import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db" // your drizzle instance
import * as schema from "@/db/schema"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "pg"
        schema: {
            user: schema.users,
            session: schema.session,
            account: schema.account,
            verification: schema.verification
        }
    }),
    emailAndPassword: {
        enabled: true
    }
})
