import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { v7 as uuidv7 } from "uuid"
import { db } from "@/db"
import * as schema from "@/db/schema/auth-schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    database: {
      generateId: () => uuidv7(),
    },
  },
})
