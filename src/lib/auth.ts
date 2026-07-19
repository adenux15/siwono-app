import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db" // your drizzle instance
import * as schema from "@/db/schema"

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "https://siwono-app.vercel.app",
    trustedOrigins: [
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://192.168.137.1:3000",
        "https://siwono-app.vercel.app"
    ].concat(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_for_development_only_siwono_12345_very_long",
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
