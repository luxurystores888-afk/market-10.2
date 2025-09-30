import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../lib/schema';

// Test database utilities
export const createTestDatabase = () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cyber_mart_test';

  const client = postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    max_lifetime: 60,
  });

  const db = drizzle(client, { schema });

  return { db, client };
};

export const setupTestDatabase = async () => {
  const { db, client } = createTestDatabase();

  try {
    // Drop all tables in reverse dependency order
    await client`
      DROP TABLE IF EXISTS evolution_cycles CASCADE;
      DROP TABLE IF EXISTS consciousness_states CASCADE;
      DROP TABLE IF EXISTS neural_connections CASCADE;
      DROP TABLE IF EXISTS state_machines CASCADE;
      DROP TABLE IF EXISTS ai_generations CASCADE;
      DROP TABLE IF EXISTS user_nft_ownership CASCADE;
      DROP TABLE IF EXISTS nft_products CASCADE;
      DROP TABLE IF EXISTS crypto_loyalty_tokens CASCADE;
      DROP TABLE IF EXISTS ipfs_storage CASCADE;
      DROP TABLE IF EXISTS crypto_transactions CASCADE;
      DROP TABLE IF EXISTS web3_wallets CASCADE;
      DROP TABLE IF EXISTS payment_transactions CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS wishlist_items CASCADE;
      DROP TABLE IF EXISTS analytics_events CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `;

    // Push schema to create tables
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    await execAsync('npm run db:push', {
      env: { ...process.env, DATABASE_URL: connectionString },
    });

    return { db, client };
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
};

export const cleanupTestDatabase = async (client: any) => {
  try {
    await client.end();
  } catch (error) {
    console.error('Failed to cleanup test database:', error);
  }
};

export const seedTestData = async (db: any) => {
  // Insert test users
  const testUsers = [
    {
      id: 'user-1',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      passwordHash: 'hashedpassword',
      role: 'customer',
      emailVerified: true,
    },
    {
      id: 'user-2',
      email: 'admin@example.com',
      username: 'admin',
      name: 'Admin User',
      passwordHash: 'hashedpassword',
      role: 'admin',
      emailVerified: true,
    },
  ];

  for (const user of testUsers) {
    await db.insert(schema.users).values(user);
  }

  // Insert test products
  const testProducts = [
    {
      id: 'product-1',
      name: 'Cyberpunk Gaming Headset',
      description: 'Immersive 7.1 surround sound gaming headset with RGB lighting',
      price: '299.99',
      category: 'Electronics',
      imageUrl: 'https://example.com/headset.jpg',
      stock: 15,
      status: 'active',
      tags: ['gaming', 'audio', 'rgb'],
    },
    {
      id: 'product-2',
      name: 'Neural Interface Glasses',
      description: 'AR glasses with neural interface capabilities for augmented reality',
      price: '899.99',
      category: 'Electronics',
      imageUrl: 'https://example.com/glasses.jpg',
      stock: 3,
      status: 'active',
      tags: ['AR', 'neural', 'tech'],
    },
    {
      id: 'product-3',
      name: 'Quantum Processor',
      description: 'Next-generation quantum processor for advanced computing',
      price: '2999.99',
      category: 'Electronics',
      imageUrl: 'https://example.com/processor.jpg',
      stock: 1,
      status: 'active',
      tags: ['quantum', 'computing', 'advanced'],
    },
  ];

  for (const product of testProducts) {
    await db.insert(schema.products).values(product);
  }

  // Insert test orders
  const testOrders = [
    {
      id: 'order-1',
      userId: 'user-1',
      status: 'completed',
      totalAmount: '599.98',
      subtotalAmount: '599.98',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      orderItems: [
        {
          productId: 'product-1',
          name: 'Cyberpunk Gaming Headset',
          price: '299.99',
          quantity: 2,
        },
      ],
      shippingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country',
      },
    },
  ];

  for (const order of testOrders) {
    await db.insert(schema.orders).values(order);
  }

  return {
    users: testUsers,
    products: testProducts,
    orders: testOrders,
  };
};
