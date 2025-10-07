import { pgTable, uuid, text, varchar, boolean, integer, decimal, real, timestamp, jsonb, json, index, uniqueIndex, serial, pgView } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
// Database schema for Cyberpunk E-commerce Platform

// Users table - Extended for custom authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).unique(),
  passwordHash: text("password_hash"),
  name: text("name"),
  emailVerified: boolean("email_verified").default(false),
  role: varchar("role", { length: 20 }).default("customer").notNull(),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  referralCode: text('referral_code').unique(),
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }),
  imageUrl: text("image_url"),
  stock: integer("stock").default(0),
  status: varchar("status", { length: 20 }).default("active"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add indexes for queries
products.addIndex('products_price_idx', ['price']);
// Partition for large data (future-proof)
export const partitionedProducts = pgTable('partitioned_products', { /* similar fields */ });
// Use bigint for IDs if needed for infinite scale
id: bigint('id').primaryKey(),

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  subtotalAmount: decimal("subtotal_amount", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  shippingAddress: jsonb("shipping_address"),
  billingAddress: jsonb("billing_address"),
  orderItems: jsonb("order_items").notNull(), // 🔧 FIX: Store line items as JSON
  orderNotes: text("order_notes"),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Analytics events
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventData: jsonb("event_data"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  referrer: text("referrer"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Wishlist items - For user's saved products
export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (table) => ({
  // 🔧 FIX: Proper unique constraint to prevent duplicate wishlist items
  uniqueUserProduct: uniqueIndex("unique_user_product_idx").on(table.userId, table.productId),
}));

// Web3 Wallets table - For wallet-based authentication
export const web3Wallets = pgTable("web3_wallets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  walletAddress: varchar("wallet_address", { length: 42 }).notNull().unique(), // Ethereum address
  walletType: varchar("wallet_type", { length: 50 }).notNull(), // MetaMask, WalletConnect, etc.
  chainId: integer("chain_id").notNull(), // 1 for Ethereum mainnet, etc.
  isActive: boolean("is_active").default(true),
  lastConnected: timestamp("last_connected").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Crypto Transactions table - For cryptocurrency payments
export const cryptoTransactions = pgTable("crypto_transactions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id").references(() => orders.id),
  walletId: uuid("wallet_id").references(() => web3Wallets.id),
  fromAddress: varchar("from_address", { length: 42 }).notNull(),
  toAddress: varchar("to_address", { length: 42 }).notNull(),
  transactionHash: varchar("transaction_hash", { length: 66 }).unique(),
  cryptocurrency: varchar("cryptocurrency", { length: 10 }).notNull(), // ETH, BTC, USDC, etc.
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  amountUsd: decimal("amount_usd", { precision: 10, scale: 2 }),
  chainId: integer("chain_id").notNull(),
  gasUsed: varchar("gas_used", { length: 20 }),
  gasPrice: varchar("gas_price", { length: 20 }),
  blockNumber: integer("block_number"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, confirmed, failed
  confirmations: integer("confirmations").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment Transactions table - Universal payment tracking for all gateways
export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id", { length: 100 }).primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  gatewayId: varchar("gateway_id", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, processing, completed, failed, cancelled, refunded
  transactionId: varchar("transaction_id", { length: 200 }), // Gateway-specific transaction ID
  gatewayResponse: jsonb("gateway_response"), // Store gateway response data
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// NFT Products table - For tokenized digital products
export const nftProducts = pgTable("nft_products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: uuid("product_id").references(() => products.id),
  contractAddress: varchar("contract_address", { length: 42 }),
  tokenId: varchar("token_id", { length: 100 }),
  tokenStandard: varchar("token_standard", { length: 10 }).default("ERC721"), // ERC721, ERC1155
  chainId: integer("chain_id").notNull(),
  metadataUri: text("metadata_uri"), // IPFS URI
  ipfsHash: varchar("ipfs_hash", { length: 100 }),
  royaltyPercentage: decimal("royalty_percentage", { precision: 5, scale: 2 }).default("2.5"),
  totalSupply: integer("total_supply").default(1),
  currentSupply: integer("current_supply").default(0),
  mintPrice: decimal("mint_price", { precision: 20, scale: 8 }),
  status: varchar("status", { length: 20 }).default("draft"), // draft, minted, transferred
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Consciousness Evolution State Machines - Advanced AI Features
export const consciousnessStates = pgTable("consciousness_states", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  connectionId: varchar("connection_id", { length: 255 }),
  userId: uuid("user_id").references(() => users.id),
  currentState: varchar("current_state", { length: 100 }).notNull(),
  stateData: jsonb("state_data").default({}),
  consciousnessLevel: real("consciousness_level").default(1.0),
  coherenceLevel: real("coherence_level").default(0.85),
  dimensions: jsonb("dimensions").default([]), // Array of active dimensions
  lastEvolution: timestamp("last_evolution").defaultNow(),
  evolutionCount: integer("evolution_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    connectionIdIdx: index("consciousness_states_connection_id_idx").on(table.connectionId),
    userIdIdx: index("consciousness_states_user_id_idx").on(table.userId),
    currentStateIdx: index("consciousness_states_current_state_idx").on(table.currentState),
    activeIdx: index("consciousness_states_active_idx").on(table.isActive),
  };
});

export const evolutionCycles = pgTable("evolution_cycles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  consciousnessStateId: uuid("consciousness_state_id").references(() => consciousnessStates.id).notNull(),
  cycleNumber: integer("cycle_number").notNull(),
  beforeState: varchar("before_state", { length: 100 }).notNull(),
  afterState: varchar("after_state", { length: 100 }).notNull(),
  triggerEvent: varchar("trigger_event", { length: 200 }),
  evolutionData: jsonb("evolution_data").default({}),
  duration: integer("duration"), // milliseconds
  success: boolean("success").default(true),
  networkEffect: real("network_effect").default(0.0),
  dimensionalShift: jsonb("dimensional_shift").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    consciousnessStateIdIdx: index("evolution_cycles_consciousness_state_id_idx").on(table.consciousnessStateId),
    cycleNumberIdx: index("evolution_cycles_cycle_number_idx").on(table.cycleNumber),
    successIdx: index("evolution_cycles_success_idx").on(table.success),
  };
});

export const neuralConnections = pgTable("neural_connections", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  connectionId: varchar("connection_id", { length: 255 }).notNull(),
  userId: uuid("user_id").references(() => users.id),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  channels: jsonb("channels").default([]), // Array of subscribed channels
  lastActivity: timestamp("last_activity").defaultNow(),
  totalMessages: integer("total_messages").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    connectionIdIdx: index("neural_connections_connection_id_idx").on(table.connectionId),
    userIdIdx: index("neural_connections_user_id_idx").on(table.userId),
    activeIdx: index("neural_connections_active_idx").on(table.isActive),
  };
});

export const stateMachines = pgTable("state_machines", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // 'consciousness', 'neural', 'quantum', 'interdimensional'
  states: jsonb("states").notNull(), // Array of state definitions
  transitions: jsonb("transitions").notNull(), // State transition rules
  initialState: varchar("initial_state", { length: 100 }).notNull(),
  finalStates: jsonb("final_states").default([]), // Array of possible end states
  evolutionRules: jsonb("evolution_rules").default({}),
  triggerConditions: jsonb("trigger_conditions").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    nameIdx: index("state_machines_name_idx").on(table.name),
    typeIdx: index("state_machines_type_idx").on(table.type),
    activeIdx: index("state_machines_active_idx").on(table.isActive),
  };
});

// AI Generations table - Track AI-created content
export const aiGenerations = pgTable("ai_generations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type", { length: 50 }).notNull(), // product, description, image, etc.
  provider: varchar("provider", { length: 50 }).notNull(), // openai, anthropic, gemini
  model: varchar("model", { length: 100 }),
  prompt: text("prompt"),
  response: text("response"),
  metadata: jsonb("metadata").default({}),
  tokensUsed: integer("tokens_used"),
  cost: decimal("cost", { precision: 10, scale: 6 }),
  responseTime: integer("response_time"), // milliseconds
  quality: real("quality"), // 0-1 score
  userId: uuid("user_id").references(() => users.id),
  productId: uuid("product_id").references(() => products.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    typeIdx: index("ai_generations_type_idx").on(table.type),
    providerIdx: index("ai_generations_provider_idx").on(table.provider),
    userIdIdx: index("ai_generations_user_id_idx").on(table.userId),
    productIdIdx: index("ai_generations_product_id_idx").on(table.productId),
  };
});

// User NFT Ownership table
export const userNftOwnership = pgTable("user_nft_ownership", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: uuid("wallet_id").references(() => web3Wallets.id),
  nftProductId: uuid("nft_product_id").references(() => nftProducts.id),
  tokenId: varchar("token_id", { length: 100 }).notNull(),
  quantity: integer("quantity").default(1),
  purchaseTransactionId: uuid("purchase_transaction_id").references(() => cryptoTransactions.id),
  acquiredAt: timestamp("acquired_at").defaultNow().notNull(),
  status: varchar("status", { length: 20 }).default("owned"), // owned, transferred, burned
});

// Crypto Loyalty Tokens table
export const cryptoLoyaltyTokens = pgTable("crypto_loyalty_tokens", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: uuid("wallet_id").references(() => web3Wallets.id),
  tokenSymbol: varchar("token_symbol", { length: 10 }).default("CYBER"), // CYBER token
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0"),
  earnedFromPurchases: decimal("earned_from_purchases", { precision: 20, scale: 8 }).default("0"),
  earnedFromReferrals: decimal("earned_from_referrals", { precision: 20, scale: 8 }).default("0"),
  spentAmount: decimal("spent_amount", { precision: 20, scale: 8 }).default("0"),
  lastEarned: timestamp("last_earned"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// IPFS Storage table - For decentralized file storage
export const ipfsStorage = pgTable("ipfs_storage", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // product, nft, user_avatar, etc.
  entityId: uuid("entity_id").notNull(),
  ipfsHash: varchar("ipfs_hash", { length: 100 }).notNull().unique(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  description: text("description"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Payment transaction types
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;

// Wishlist types
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = typeof wishlistItems.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;

// Web3 types
export type Web3Wallet = typeof web3Wallets.$inferSelect;
export type InsertWeb3Wallet = typeof web3Wallets.$inferInsert;
export type CryptoTransaction = typeof cryptoTransactions.$inferSelect;
export type InsertCryptoTransaction = typeof cryptoTransactions.$inferInsert;
export type NftProduct = typeof nftProducts.$inferSelect;
export type InsertNftProduct = typeof nftProducts.$inferInsert;
export type UserNftOwnership = typeof userNftOwnership.$inferSelect;
export type InsertUserNftOwnership = typeof userNftOwnership.$inferInsert;
export type CryptoLoyaltyToken = typeof cryptoLoyaltyTokens.$inferSelect;
export type InsertCryptoLoyaltyToken = typeof cryptoLoyaltyTokens.$inferInsert;
export type IpfsStorage = typeof ipfsStorage.$inferSelect;
export type InsertIpfsStorage = typeof ipfsStorage.$inferInsert;

// Consciousness Evolution types
export type ConsciousnessState = typeof consciousnessStates.$inferSelect;
export type InsertConsciousnessState = typeof consciousnessStates.$inferInsert;
export type EvolutionCycle = typeof evolutionCycles.$inferSelect;
export type InsertEvolutionCycle = typeof evolutionCycles.$inferInsert;
export type NeuralConnection = typeof neuralConnections.$inferSelect;
export type InsertNeuralConnection = typeof neuralConnections.$inferInsert;
export type AIGeneration = typeof aiGenerations.$inferSelect;
export type InsertAIGeneration = typeof aiGenerations.$inferInsert;
export type StateMachine = typeof stateMachines.$inferSelect;
export type InsertStateMachine = typeof stateMachines.$inferInsert;

// Aliases for compatibility with web3.ts
export const nftTokens = nftProducts;
export const ipfsFiles = ipfsStorage;

export const loyaltyPoints = pgTable('loyalty_points', {
  userId: varchar('user_id', { length: 255 }).primaryKey().references(() => users.id),
  totalPoints: integer('total_points').default(0),
  availablePoints: integer('available_points').default(0),
  lifetimePoints: integer('lifetime_points').default(0),
  currentTier: varchar('current_tier', { length: 50 }).default('bronze'),
  streakDays: integer('streak_days').default(0),
  lastActivity: timestamp('last_activity').defaultNow(),
});

export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoints = typeof loyaltyPoints.$inferInsert;

export const rewards = pgTable('rewards', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  cost: integer('cost').notNull(),
  type: varchar('type', { length: 50 }),
  value: varchar('value', { length: 100 }),
  availability: varchar('availability', { length: 50 }).default('available'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Reward = typeof rewards.$inferSelect;
export type InsertReward = typeof rewards.$inferInsert;

export const redemptions = pgTable('redemptions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  rewardId: integer('reward_id').references(() => rewards.id),
  pointsSpent: integer('points_spent').notNull(),
  status: varchar('status', { length: 50 }).default('redeemed'),
  redeemedAt: timestamp('redeemed_at').defaultNow(),
});

export type Redemption = typeof redemptions.$inferSelect;
export type InsertRedemption = typeof redemptions.$inferInsert;

export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  type: text('type'),
  progress: integer('progress'),
  target: integer('target'),
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;

export const challengeCompletions = pgTable('challenge_completions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  challengeId: integer('challenge_id').references(() => challenges.id),
  progress: integer('progress').default(0),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
});

export type ChallengeCompletion = typeof challengeCompletions.$inferSelect;
export type InsertChallengeCompletion = typeof challengeCompletions.$inferInsert;

export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 50 }),
  priority: varchar('priority', { length: 50 }).default('medium'),
  status: varchar('status', { length: 50 }).default('open'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

export const chatSessions = pgTable('chat_sessions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  agentId: varchar('agent_id', { length: 255 }),
  category: varchar('category', { length: 50 }),
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  endedAt: timestamp('ended_at'),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => chatSessions.id),
  sender: varchar('sender', { length: 50 }).notNull(), // 'user' or 'agent' or 'bot'
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

export const forumPosts = pgTable('forum_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  category: varchar('category', { length: 50 }),
  tags: json('tags').default([]),
  likes: integer('likes').default(0),
  replies: integer('replies').default(0),
  isPinned: boolean('is_pinned').default(false),
  isLocked: boolean('is_locked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = typeof forumPosts.$inferInsert;

export const forumReplies = pgTable('forum_replies', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => forumPosts.id),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  content: text('content').notNull(),
  likes: integer('likes').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = typeof forumReplies.$inferInsert;

export const productReviews = pgTable('product_reviews', {
  id: serial('id').primaryKey(),
  productId: varchar('product_id', { length: 255 }).references(() => products.id),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  rating: integer('rating').notNull(),
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),
  verified: boolean('verified').default(false),
  helpful: integer('helpful').default(0),
  notHelpful: integer('not_helpful').default(0),
  images: json('images').default([]),
  tags: json('tags').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = typeof productReviews.$inferInsert;

export const restockSubscriptions = pgTable('restock_subscriptions', {
  id: serial('id').primaryKey(),
  productId: varchar('product_id', { length: 255 }).references(() => products.id),
  subscription: json('subscription').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type RestockSubscription = typeof restockSubscriptions.$inferSelect;
export type InsertRestockSubscription = typeof restockSubscriptions.$inferInsert;

// Example query with join
// db.select().from(products).leftJoin(orders, eq(products.id, orders.productId));

export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  referrerId: text('referrer_id').references(() => users.id),
  referredId: text('referred_id').references(() => users.id),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: text('product_id').references(() => products.id),
  userId: text('user_id').references(() => users.id),
  rating: integer('rating'),
  title: text('title'),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const affiliateNetwork = pgTable('affiliate_network', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  inviteeId: text('invitee_id').references(() => users.id),
});

export const giveawayEntries = pgTable('giveaway_entries', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
});

export const trafficMagnets = pgTable('traffic_magnets', {
  id: serial('id').primaryKey(),
  pingTime: timestamp('ping_time'),
});

export const trafficSources = pgTable('traffic_sources', {
  id: serial('id').primaryKey(),
  source: text('source'),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  status: text('status'),
});

export const multipliers = pgTable('multipliers', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  factor: integer('factor'),
});

export const ascensionLevels = pgTable('ascension_levels', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  level: integer('level'),
});

// Simulate sharding with views
export const shardedView = pgView('sharded_view').as(qb => qb.select().from(products));

export const continuumView = pgView('continuum_view').as(qb => qb.select().from(orders));