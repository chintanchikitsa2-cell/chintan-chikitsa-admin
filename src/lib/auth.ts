import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

/* ----------------------------------------
   mongoDB client (cached):
---------------------------------------- */
import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL as string;

if (!MONGO_URL) {
  throw new Error("MONGO_URL missing");
}

type MongoCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

const globalForMongo = global as unknown as {
  _betterAuthMongo?: MongoCache;
};

const cached =
  globalForMongo._betterAuthMongo ??
  (globalForMongo._betterAuthMongo = {
    client: null,
    promise: null,
  });

async function getClient() {
  if (cached.client) return cached.client;

  if (!cached.promise) {
    cached.promise = new MongoClient(MONGO_URL).connect();
  }

  cached.client = await cached.promise;
  return cached.client;
}

const client = await getClient();
const db = client.db();

/* ----------------------------------------
   Better Auth config
---------------------------------------- */

const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  emailAndPassword: {
    enabled: true,
  },

});

export default auth;