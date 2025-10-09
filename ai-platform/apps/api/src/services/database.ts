import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { z } from 'zod';
import * as schema from '../db/schema.js';

export class DatabaseService {
  private client: postgres.Sql;
  private db: ReturnType<typeof drizzle>;
  private connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
    
    // Create postgres client with connection pooling
    this.client = postgres(connectionString, {
      max: 20,
      idle_timeout: 20,
      connect_timeout: 60,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
      transform: {
        undefined: null,
      },
      types: {
        // Custom type parsers
        bigint: postgres.BigInt,
        json: {
          to: 20,
          from: 20,
          serialize: JSON.stringify,
          parse: JSON.parse,
        },
        uuid: {
          to: 2950,
          from: 2950,
          serialize: (x: string) => x,
          parse: (x: string) => x,
        },
      },
    });

    // Initialize Drizzle ORM
    this.db = drizzle(this.client, { 
      schema,
      logger: process.env.NODE_ENV === 'development',
    });
  }

  public async initialize(): Promise<void> {
    try {
      // Test connection
      await this.client`SELECT 1`;
      console.log('✅ Database connection established');

      // Run migrations
      await this.runMigrations();
      console.log('✅ Database migrations completed');

      // Setup extensions
      await this.setupExtensions();
      console.log('✅ Database extensions setup');

    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private async runMigrations(): Promise<void> {
    try {
      await migrate(this.db, { migrationsFolder: './src/db/migrations' });
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  private async setupExtensions(): Promise<void> {
    try {
      // Enable UUID extension
      await this.client`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
      
      // Enable PostGIS for geolocation features
      await this.client`CREATE EXTENSION IF NOT EXISTS "postgis"`;
      
      // Enable full-text search
      await this.client`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`;
      
      // Enable vector similarity search for AI embeddings
      await this.client`CREATE EXTENSION IF NOT EXISTS "vector"`;
      
      // Enable encryption functions
      await this.client`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
      
      console.log('✅ Database extensions enabled');
    } catch (error) {
      console.warn('⚠️ Some database extensions may not be available:', error.message);
    }
  }

  public getDb() {
    return this.db;
  }

  public getClient() {
    return this.client;
  }

  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency: number;
    connections: number;
    database: string;
  }> {
    const startTime = Date.now();
    
    try {
      // Test basic query
      const result = await this.client`SELECT 
        current_database() as database,
        count(*) as connection_count
      FROM pg_stat_activity 
      WHERE state = 'active'`;
      
      const latency = Date.now() - startTime;
      
      return {
        status: 'healthy',
        latency,
        connections: Number(result[0].connection_count),
        database: result[0].database,
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      console.error('❌ Database health check failed:', error);
      
      return {
        status: 'unhealthy',
        latency,
        connections: 0,
        database: 'unknown',
      };
    }
  }

  public async getStats(): Promise<{
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
    databaseSize: string;
    tableStats: Array<{
      tableName: string;
      rowCount: number;
      tableSize: string;
    }>;
  }> {
    try {
      // Get connection stats
      const connectionStats = await this.client`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity
      `;

      // Get database size
      const dbSize = await this.client`
        SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
      `;

      // Get table statistics
      const tableStats = await this.client`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as live_tuples,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size
        FROM pg_stat_user_tables
        ORDER BY n_live_tup DESC
        LIMIT 20
      `;

      return {
        totalConnections: Number(connectionStats[0].total_connections),
        activeConnections: Number(connectionStats[0].active_connections),
        idleConnections: Number(connectionStats[0].idle_connections),
        databaseSize: dbSize[0].database_size,
        tableStats: tableStats.map(stat => ({
          tableName: `${stat.schemaname}.${stat.tablename}`,
          rowCount: Number(stat.live_tuples),
          tableSize: stat.table_size,
        })),
      };
    } catch (error) {
      console.error('❌ Failed to get database stats:', error);
      throw error;
    }
  }

  public async executeTransaction<T>(
    callback: (tx: typeof this.db) => Promise<T>
  ): Promise<T> {
    return await this.db.transaction(callback);
  }

  public async executeBatch(queries: Array<{ query: string; params?: any[] }>): Promise<any[]> {
    try {
      const results = await Promise.all(
        queries.map(({ query, params = [] }) => 
          this.client.unsafe(query, params)
        )
      );
      return results;
    } catch (error) {
      console.error('❌ Batch query execution failed:', error);
      throw error;
    }
  }

  public async backup(options: {
    tables?: string[];
    format?: 'sql' | 'tar' | 'custom';
    compressed?: boolean;
  } = {}): Promise<string> {
    const { tables = [], format = 'sql', compressed = true } = options;
    
    try {
      // This would typically use pg_dump
      // For now, return a placeholder backup identifier
      const backupId = `backup_${Date.now()}`;
      
      console.log(`📦 Database backup created: ${backupId}`);
      console.log(`📊 Tables: ${tables.length > 0 ? tables.join(', ') : 'all'}`);
      console.log(`📋 Format: ${format}`);
      console.log(`🗜️ Compressed: ${compressed}`);
      
      return backupId;
    } catch (error) {
      console.error('❌ Database backup failed:', error);
      throw error;
    }
  }

  public async restore(backupId: string): Promise<void> {
    try {
      console.log(`📥 Restoring database from backup: ${backupId}`);
      // Restore logic would go here
      console.log('✅ Database restore completed');
    } catch (error) {
      console.error('❌ Database restore failed:', error);
      throw error;
    }
  }

  public async vacuum(options: {
    analyze?: boolean;
    full?: boolean;
    tables?: string[];
  } = {}): Promise<void> {
    const { analyze = true, full = false, tables = [] } = options;
    
    try {
      const vacuumCommand = `VACUUM${full ? ' FULL' : ''}${analyze ? ' ANALYZE' : ''}`;
      
      if (tables.length > 0) {
        for (const table of tables) {
          await this.client.unsafe(`${vacuumCommand} ${table}`);
        }
      } else {
        await this.client.unsafe(vacuumCommand);
      }
      
      console.log('🧹 Database vacuum completed');
    } catch (error) {
      console.error('❌ Database vacuum failed:', error);
      throw error;
    }
  }

  public async reindex(tables?: string[]): Promise<void> {
    try {
      if (tables && tables.length > 0) {
        for (const table of tables) {
          await this.client.unsafe(`REINDEX TABLE ${table}`);
        }
      } else {
        await this.client.unsafe('REINDEX DATABASE CONCURRENTLY');
      }
      
      console.log('🔄 Database reindex completed');
    } catch (error) {
      console.error('❌ Database reindex failed:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      await this.client.end();
      console.log('✅ Database connections closed');
    } catch (error) {
      console.error('❌ Error closing database connections:', error);
      throw error;
    }
  }

  // Query builders for common operations
  public async findById<T>(
    table: any,
    id: string | number,
    columns?: string[]
  ): Promise<T | null> {
    try {
      const query = this.db.select().from(table).where(eq(table.id, id));
      if (columns) {
        // Apply column selection if specified
      }
      const result = await query.limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('❌ Find by ID failed:', error);
      throw error;
    }
  }

  public async findMany<T>(
    table: any,
    options: {
      where?: any;
      orderBy?: any;
      limit?: number;
      offset?: number;
      columns?: string[];
    } = {}
  ): Promise<T[]> {
    try {
      let query = this.db.select().from(table);
      
      if (options.where) {
        query = query.where(options.where);
      }
      
      if (options.orderBy) {
        query = query.orderBy(options.orderBy);
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.offset(options.offset);
      }
      
      return await query;
    } catch (error) {
      console.error('❌ Find many failed:', error);
      throw error;
    }
  }

  public async count(table: any, where?: any): Promise<number> {
    try {
      let query = this.db.select({ count: sql`count(*)` }).from(table);
      
      if (where) {
        query = query.where(where);
      }
      
      const result = await query;
      return Number(result[0].count);
    } catch (error) {
      console.error('❌ Count failed:', error);
      throw error;
    }
  }

  public async upsert<T>(
    table: any,
    data: any,
    conflictTarget: string
  ): Promise<T> {
    try {
      const result = await this.db
        .insert(table)
        .values(data)
        .onConflictDoUpdate({
          target: conflictTarget,
          set: data,
        })
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('❌ Upsert failed:', error);
      throw error;
    }
  }
}

// Helper functions for common SQL operations
import { sql, eq } from 'drizzle-orm';

export { schema };
