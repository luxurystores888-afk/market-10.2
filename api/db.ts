import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Initialize database connection
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/cybermart2077";

let db;

try {
  // Use Neon serverless driver
  const sql = neon(databaseUrl);
  db = drizzle(sql);
  console.log('✅ Connected to database successfully');
} catch (error) {
  console.error('❌ Database connection failed:', error);
  
  // Fallback to mock database for development
  db = {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve([]),
        }),
        limit: () => Promise.resolve([]),
      }),
    }),
    insert: () => ({
      values: () => Promise.resolve({ rows: [] }),
    }),
    update: () => ({
      set: () => ({
        where: () => Promise.resolve({ rows: [] }),
      }),
    }),
    delete: () => ({
      where: () => Promise.resolve({ rows: [] }),
    }),
    execute: () => Promise.resolve({ rows: [] }),
    query: () => Promise.resolve({ rows: [] }),
  };
  
  console.warn('⚠️  Using mock database. Please configure DATABASE_URL environment variable.');
}

// Export db
export { db };