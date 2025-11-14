import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const DB_URI = Bun.env.DB_URI || "";

const client = new MongoClient(DB_URI);
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        // userCollection: "users",
        // sessionCollection: "sessions",
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    
});