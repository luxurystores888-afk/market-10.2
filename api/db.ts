import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/schema";

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/cybermart2077";

// Create the connection with error handling
const connectionString = databaseUrl;
const client = postgres(connectionString, { 
  prepare: false,
  onnotice: () => {}, // Silence PostgreSQL notices
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 30 // Connection timeout after 30 seconds
});

export const db = drizzle(client, { schema });

// Log database connection for debugging
console.log('🗄️ Database connection initialized:', databaseUrl.replace(/:[^:@]*@/, ':***@'));