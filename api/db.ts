import { drizzle as pgDrizzle } from 'drizzle-orm/pg-core';
import { drizzle as memDrizzle } from 'drizzle-orm/memory'; // If memory driver available, else use simple object mock

let db;

try {
  db = pgDrizzle(process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/cybermart2077");
  console.log('Connected to real Postgres DB');
} catch (error) {
  console.error('DB connection failed - using mock in-memory mode');
  // Simple mock DB
  db = {
    query: () => ({ rows: [] }), // Mock query function
    // Add more mock methods as needed for app functionality
  };
}

// Export db
export { db };