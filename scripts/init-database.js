#!/usr/bin/env node

/**
 * 🗄️ DATABASE INITIALIZATION SCRIPT
 * Creates and seeds the Cyber Mart 2077 database
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from '../lib/schema.js';
import { faker } from '@faker-js/faker';

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/cybermart2077';
const sql = postgres(connectionString);
const db = drizzle(sql, { schema });

async function initDatabase() {
  console.log('🚀 Initializing Cyber Mart 2077 Database...\n');

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await sql`SELECT 1`;
    console.log('✅ Database connection successful\n');

    // Create tables
    console.log('🏗️  Creating database tables...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        category VARCHAR(100),
        stock_quantity INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(50),
        shipping_address JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        user_id INTEGER REFERENCES users(id),
        session_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database tables created successfully\n');

    // Seed data
    console.log('🌱 Seeding database with initial data...');
    await seedDatabase();
    console.log('✅ Database seeded successfully\n');

    console.log('🎉 Database initialization complete!');
    console.log('📊 Summary:');
    console.log('   - Tables: 5 created');
    console.log('   - Users: 10 seeded');
    console.log('   - Products: 20 seeded');
    console.log('   - Orders: 15 seeded');
    console.log('   - Analytics: 50 events seeded');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

async function seedDatabase() {
  // Seed users
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({
      email: faker.internet.email(),
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', // 'password123'
      name: faker.person.fullName(),
      avatar_url: faker.image.avatar(),
      role: i === 0 ? 'admin' : 'customer'
    });
  }

  await db.execute(sql`
    INSERT INTO users (email, password_hash, name, avatar_url, role)
    VALUES ${sql(users.map(u => [u.email, u.password_hash, u.name, u.avatar_url, u.role]))}
    ON CONFLICT (email) DO NOTHING
  `);

  // Seed products
  const products = [
    {
      name: 'Cyberpunk Neural Interface',
      description: 'Direct brain-computer interface for enhanced cognitive abilities',
      price: 2999.99,
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500',
      category: 'Neural Tech',
      stock_quantity: 50,
      is_featured: true
    },
    {
      name: 'Quantum Encryption Device',
      description: 'Unbreakable quantum encryption for secure communications',
      price: 1999.99,
      image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500',
      category: 'Security',
      stock_quantity: 25,
      is_featured: true
    },
    {
      name: 'Holographic Display Terminal',
      description: '3D holographic display for immersive computing experience',
      price: 1499.99,
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500',
      category: 'Display Tech',
      stock_quantity: 75,
      is_featured: false
    },
    {
      name: 'AI Personal Assistant Drone',
      description: 'Flying AI assistant with advanced natural language processing',
      price: 899.99,
      image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500',
      category: 'AI Tech',
      stock_quantity: 100,
      is_featured: true
    },
    {
      name: 'Cyberpunk Smart Glasses',
      description: 'AR-enabled smart glasses with neural link compatibility',
      price: 599.99,
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500',
      category: 'Wearables',
      stock_quantity: 200,
      is_featured: false
    }
  ];

  // Add more random products
  for (let i = 0; i < 15; i++) {
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 99, max: 2999 })),
      image_url: faker.image.url(),
      category: faker.helpers.arrayElement(['Neural Tech', 'Security', 'Display Tech', 'AI Tech', 'Wearables', 'Gaming', 'Communication']),
      stock_quantity: faker.number.int({ min: 10, max: 500 }),
      is_featured: faker.datatype.boolean()
    });
  }

  await db.execute(sql`
    INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_featured)
    VALUES ${sql(products.map(p => [p.name, p.description, p.price, p.image_url, p.category, p.stock_quantity, p.is_featured]))}
  `);

  // Seed orders
  const orders = [];
  for (let i = 0; i < 15; i++) {
    orders.push({
      user_id: faker.number.int({ min: 1, max: 10 }),
      total_amount: parseFloat(faker.commerce.price({ min: 99, max: 2999 })),
      status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      payment_method: faker.helpers.arrayElement(['credit_card', 'crypto', 'paypal', 'bank_transfer']),
      shipping_address: JSON.stringify({
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country()
      })
    });
  }

  await db.execute(sql`
    INSERT INTO orders (user_id, total_amount, status, payment_method, shipping_address)
    VALUES ${sql(orders.map(o => [o.user_id, o.total_amount, o.status, o.payment_method, o.shipping_address]))}
  `);

  // Seed analytics events
  const analytics = [];
  for (let i = 0; i < 50; i++) {
    analytics.push({
      event_type: faker.helpers.arrayElement(['page_view', 'product_view', 'add_to_cart', 'purchase', 'search']),
      event_data: JSON.stringify({
        page: faker.helpers.arrayElement(['/', '/products', '/cart', '/checkout']),
        product_id: faker.number.int({ min: 1, max: 20 }),
        search_term: faker.commerce.productName()
      }),
      user_id: faker.number.int({ min: 1, max: 10 }),
      session_id: faker.string.uuid()
    });
  }

  await db.execute(sql`
    INSERT INTO analytics (event_type, event_data, user_id, session_id)
    VALUES ${sql(analytics.map(a => [a.event_type, a.event_data, a.user_id, a.session_id]))}
  `);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase();
}

export { initDatabase };
