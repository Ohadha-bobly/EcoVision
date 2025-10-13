import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import ws from "ws";

// Configure Neon to use WebSocket
neonConfig.webSocketConstructor = ws;

// Disable SSL verification for self-signed certificates (development)
neonConfig.pipelineConnect = false;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
});
export const db = drizzle(pool, { schema });
