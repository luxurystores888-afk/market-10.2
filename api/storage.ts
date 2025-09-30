import { 
  users, products, analyticsEvents, orders, paymentTransactions, wishlistItems,
  type User, type InsertUser, 
  type Product, type InsertProduct,
  type AnalyticsEvent, type InsertAnalyticsEvent,
  type Order, type InsertOrder,
  type PaymentTransaction, type InsertPaymentTransaction,
  type WishlistItem, type InsertWishlistItem,
  loyaltyPoints, type LoyaltyPoints, type InsertLoyaltyPoints,
  rewards, type Reward,
  redemptions, type InsertRedemption,
  challenges, type Challenge,
  challengeCompletions, type ChallengeCompletion, type InsertChallengeCompletion,
  supportTickets, type SupportTicket, type InsertSupportTicket,
  chatSessions, type ChatSession, type InsertChatSession,
  chatMessages, type ChatMessage, type InsertChatMessage,
  forumPosts, type ForumPost, type InsertForumPost,
  forumReplies, type ForumReply, type InsertForumReply,
  productReviews, type ProductReview, type InsertProductReview,
  restockSubscriptions, type RestockSubscription, type InsertRestockSubscription
} from "../lib/schema";
import { randomUUID } from "node:crypto";
import { db } from "./db";
import { eq, and, like, gte, lte, desc, asc, sql, count, inArray, isNull, or, gt } from "drizzle-orm";
import { DatabasePerformanceTracker } from "./middleware/performanceMonitoring";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(filters?: { email?: string; username?: string }): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  updateUserPassword(id: string, passwordHash: string): Promise<void>;
  setPasswordResetToken(id: string, token: string): Promise<void>;
  
  // Product operations
  getProducts(filters?: { category?: string; status?: string; search?: string }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Analytics operations
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(filters?: { eventType?: string; startDate?: Date; endDate?: Date; userId?: string }): Promise<AnalyticsEvent[]>;
  
  // Order operations
  getOrders(filters?: { userId?: string; status?: string }): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  
  // Payment transaction operations
  getPaymentTransaction(id: string): Promise<PaymentTransaction | undefined>;
  createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction>;
  updatePaymentTransactionStatus(id: string, status: string): Promise<PaymentTransaction>;
  
  // Wishlist operations
  getUserWishlist(userId: string): Promise<(WishlistItem & { product: Product })[]>;
  addToWishlist(userId: string, productId: string): Promise<WishlistItem>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;
  isInWishlist(userId: string, productId: string): Promise<boolean>;

  // Loyalty operations
  getUserLoyalty(userId: string): Promise<LoyaltyPoints>;
  getAvailableRewards(userId: string): Promise<Reward[]>;
  redeemReward(userId: string, rewardId: number): Promise<InsertRedemption>;
  getActiveChallenges(userId: string): Promise<(Challenge & { progress: number; completed: boolean })[]>;
  completeChallenge(userId: string, challengeId: number): Promise<ChallengeCompletion>;

  // Support operations
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getUserTickets(userId: string): Promise<SupportTicket[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  sendChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Community operations
  getForumPosts(filters?: { category?: string }): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getProductReviews(productId: string): Promise<ProductReview[]>;
  createProductReview(review: InsertProductReview): Promise<ProductReview>;

  // Aggregate analytics
  getSalesAnalytics(range: string): Promise<any>;
  getUserAnalytics(): Promise<any>;
  getProductAnalytics(): Promise<any>;
  getSystemAnalytics(): Promise<any>;

  getRestockSubscribers(productId: string): Promise<RestockSubscription[]>;
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return await DatabasePerformanceTracker.trackQuery(
      'getUser',
      async () => {
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return result[0];
      },
      { id }
    );
  }

  async getUsers(filters?: { email?: string; username?: string }): Promise<User[]> {
    return await DatabasePerformanceTracker.trackQuery(
      'getUsers',
      async () => {
        const conditions: any[] = [];
        if (filters?.email) {
          conditions.push(eq(users.email, filters.email));
        }
        if (filters?.username) {
          conditions.push(eq(users.username, filters.username));
        }
        
        if (conditions.length > 0) {
          return await db.select().from(users).where(and(...conditions));
        }
        return await db.select().from(users);
      },
      filters
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = { ...user, id: user.id || randomUUID() };
    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, id));
  }

  async updateUserPassword(id: string, passwordHash: string): Promise<void> {
    await db.update(users)
      .set({ 
        passwordHash, 
        resetPasswordToken: null, 
        resetPasswordExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
  }

  async setPasswordResetToken(id: string, token: string): Promise<void> {
    const bcrypt = require('bcryptjs');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry
    
    // 🔒 SECURITY FIX: Hash password reset tokens before storage
    const hashedToken = await bcrypt.hash(token, 12);
    
    await db.update(users)
      .set({ 
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expires,
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
  }

  // Product operations - 🚀 PERFORMANCE MONITORED (was 2.7s bottleneck)
  async getProducts(filters?: { category?: string; status?: string; search?: string; limit?: number }): Promise<Product[]> {
    return await DatabasePerformanceTracker.trackQuery(
      'getProducts',
      async () => {
        const conditions: any[] = [];
        if (filters?.category) {
          conditions.push(eq(products.category, filters.category));
        }
        if (filters?.status) {
          conditions.push(eq(products.status, filters.status));
        }
        if (filters?.search) {
          conditions.push(like(products.name, `%${filters.search}%`));
        }
        
        // Build query with proper typing
        const baseQuery = db.select().from(products);
        
        if (conditions.length > 0) {
          const limitedQuery = baseQuery.where(and(...conditions)).orderBy(desc(products.createdAt));
          return filters?.limit ? await limitedQuery.limit(filters.limit) : await limitedQuery;
        } else {
          const orderedQuery = baseQuery.orderBy(desc(products.createdAt));
          return filters?.limit ? await orderedQuery.limit(filters.limit) : await orderedQuery;
        }
      },
      filters
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return await DatabasePerformanceTracker.trackQuery(
      'getProduct',
      async () => {
        const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
        return result[0];
      },
      { id }
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct = { ...product, id: product.id || randomUUID() };
    const result = await db.insert(products).values(newProduct).returning();
    return result[0];
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const result = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Analytics operations
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const newEvent = { ...event, id: event.id || randomUUID() };
    const result = await db.insert(analyticsEvents).values(newEvent).returning();
    return result[0];
  }

  async getAnalyticsEvents(filters?: { eventType?: string; startDate?: Date; endDate?: Date; userId?: string }): Promise<AnalyticsEvent[]> {
    const conditions: any[] = [];
    if (filters?.eventType) {
      conditions.push(eq(analyticsEvents.eventType, filters.eventType));
    }
    if (filters?.userId) {
      conditions.push(eq(analyticsEvents.userId, filters.userId));
    }
    if (filters?.startDate) {
      conditions.push(gte(analyticsEvents.timestamp, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(analyticsEvents.timestamp, filters.endDate));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(analyticsEvents).where(and(...conditions)).orderBy(desc(analyticsEvents.timestamp));
    }
    return await db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.timestamp));
  }

  // Payment transaction operations
  async getPaymentTransaction(id: string): Promise<PaymentTransaction | undefined> {
    return await DatabasePerformanceTracker.trackQuery(
      'getPaymentTransaction',
      async () => {
        const result = await db.select().from(paymentTransactions).where(eq(paymentTransactions.id, id)).limit(1);
        return result[0];
      },
      { id }
    );
  }

  async createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    return await DatabasePerformanceTracker.trackQuery(
      'createPaymentTransaction',
      async () => {
        const result = await db.insert(paymentTransactions).values(transaction).returning();
        return result[0];
      },
      transaction
    );
  }

  async updatePaymentTransactionStatus(id: string, status: string): Promise<PaymentTransaction> {
    return await DatabasePerformanceTracker.trackQuery(
      'updatePaymentTransactionStatus',
      async () => {
        const result = await db
          .update(paymentTransactions)
          .set({ status, updatedAt: new Date() })
          .where(eq(paymentTransactions.id, id))
          .returning();
        return result[0];
      },
      { id, status }
    );
  }

  // Order operations
  async getOrders(filters?: { userId?: string; status?: string }): Promise<Order[]> {
    const conditions: any[] = [];
    if (filters?.userId) {
      conditions.push(eq(orders.userId, filters.userId));
    }
    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(orders).where(and(...conditions)).orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder = { ...order, id: order.id || randomUUID() };
    const result = await db.insert(orders).values(newOrder).returning();
    return result[0];
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const result = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return result[0];
  }

  // Product stock management for order fulfillment
  async updateProductStock(productId: string, quantityChange: number): Promise<Product> {
    return await DatabasePerformanceTracker.trackQuery(
      'updateProductStock',
      async () => {
        const result = await db
          .update(products)
          .set({ 
            stock: sql`${products.stock} + ${quantityChange}`,
            updatedAt: new Date()
          })
          .where(eq(products.id, productId))
          .returning();
        return result[0];
      },
      { productId, quantityChange }
    );
  }

  // Wishlist operations
  async getUserWishlist(userId: string): Promise<(WishlistItem & { product: Product })[]> {
    return await DatabasePerformanceTracker.trackQuery(
      'getUserWishlist',
      async () => {
        const result = await db
          .select({
            id: wishlistItems.id,
            userId: wishlistItems.userId,
            productId: wishlistItems.productId,
            addedAt: wishlistItems.addedAt,
            product: products
          })
          .from(wishlistItems)
          .innerJoin(products, eq(wishlistItems.productId, products.id))
          .where(eq(wishlistItems.userId, userId))
          .orderBy(desc(wishlistItems.addedAt));
        return result;
      },
      { userId }
    );
  }

  async addToWishlist(userId: string, productId: string): Promise<WishlistItem> {
    return await DatabasePerformanceTracker.trackQuery(
      'addToWishlist',
      async () => {
        const result = await db
          .insert(wishlistItems)
          .values({ userId, productId })
          .onConflictDoNothing()
          .returning();
        return result[0];
      },
      { userId, productId }
    );
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await DatabasePerformanceTracker.trackQuery(
      'removeFromWishlist',
      async () => {
        await db
          .delete(wishlistItems)
          .where(and(
            eq(wishlistItems.userId, userId),
            eq(wishlistItems.productId, productId)
          ));
      },
      { userId, productId }
    );
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    return await DatabasePerformanceTracker.trackQuery(
      'isInWishlist',
      async () => {
        const result = await db
          .select({ id: wishlistItems.id })
          .from(wishlistItems)
          .where(and(
            eq(wishlistItems.userId, userId),
            eq(wishlistItems.productId, productId)
          ))
          .limit(1);
        return result.length > 0;
      },
      { userId, productId }
    );
  }

  // Loyalty operations
  async getUserLoyalty(userId: string): Promise<LoyaltyPoints> {
    const result = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId)).limit(1);
    return result[0] || { userId, totalPoints: 0, availablePoints: 0, lifetimePoints: 0, currentTier: 'bronze', streakDays: 0, lastActivity: new Date() };
  }

  async getAvailableRewards(userId: string): Promise<Reward[]> {
    return await db.select().from(rewards).where(eq(rewards.availability, 'available'));
  }

  async redeemReward(userId: string, rewardId: number): Promise<InsertRedemption> {
    const reward = await db.select().from(rewards).where(eq(rewards.id, rewardId)).limit(1);
    if (!reward[0]) throw new Error('Reward not found');
    // Deduct points logic here (simplified)
    await db.update(loyaltyPoints).set({ availablePoints: sql`${loyaltyPoints.availablePoints} - ${reward[0].cost}` }).where(eq(loyaltyPoints.userId, userId));
    const result = await db.insert(redemptions).values({ userId, rewardId, pointsSpent: reward[0].cost }).returning();
    return result[0];
  }

  async getActiveChallenges(userId: string): Promise<(Challenge & { progress: number; completed: boolean })[]> {
    return await db.select({
      ...challenges,
      progress: challengeCompletions.progress,
      completed: challengeCompletions.completed
    }).from(challenges)
      .leftJoin(challengeCompletions, and(eq(challengeCompletions.challengeId, challenges.id), eq(challengeCompletions.userId, userId)))
      .where(gt(challenges.expiresAt, new Date()));
  }

  async completeChallenge(userId: string, challengeId: number): Promise<ChallengeCompletion> {
    const challenge = await db.select().from(challenges).where(eq(challenges.id, challengeId)).limit(1);
    if (!challenge[0]) throw new Error('Challenge not found');
    // Award points (simplified)
    await db.update(loyaltyPoints).set({ totalPoints: sql`${loyaltyPoints.totalPoints} + ${challenge[0].reward}` }).where(eq(loyaltyPoints.userId, userId));
    const result = await db.insert(challengeCompletions).values({ userId, challengeId, progress: challenge[0].target, completed: true, completedAt: new Date() }).returning();
    return result[0];
  }

  // Support operations
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const result = await db.insert(supportTickets).values(ticket).returning();
    return result[0];
  }

  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets).where(eq(supportTickets.userId, userId)).orderBy(desc(supportTickets.createdAt));
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const result = await db.insert(chatSessions).values(session).returning();
    return result[0];
  }

  async sendChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }

  // Community operations
  async getForumPosts(filters?: { category?: string }): Promise<ForumPost[]> {
    if (filters?.category) {
      return await db.select().from(forumPosts).where(eq(forumPosts.category, filters.category)).orderBy(desc(forumPosts.createdAt));
    }
    return await db.select().from(forumPosts).orderBy(desc(forumPosts.createdAt));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const result = await db.insert(forumPosts).values(post).returning();
    return result[0];
  }

  async getProductReviews(productId: string): Promise<ProductReview[]> {
    return await db.select().from(productReviews).where(eq(productReviews.productId, productId)).orderBy(desc(productReviews.createdAt));
  }

  async createProductReview(review: InsertProductReview): Promise<ProductReview> {
    const result = await db.insert(productReviews).values(review).returning();
    return result[0];
  }

  // Aggregate analytics
  async getSalesAnalytics(range: string): Promise<any> {
    const cutoff = new Date();
    if (range === '7d') cutoff.setDate(cutoff.getDate() - 7);
    else if (range === '30d') cutoff.setDate(cutoff.getDate() - 30);
    else if (range === '90d') cutoff.setDate(cutoff.getDate() - 90);

    const orders = await db.select().from(orders).where(gte(orders.createdAt, cutoff));
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
    // Add more calculations as in routes
    return { totalRevenue, totalOrders: orders.length /* etc */ };
  }

  async getUserAnalytics(): Promise<any> {
    const totalUsers = await db.select({ count: count() }).from(users);
    // Add more
    return { totalUsers: totalUsers[0].count /* etc */ };
  }

  async getProductAnalytics(): Promise<any> {
    const products = await this.getProducts();
    const totalProducts = products.length;
    // Add calculations
    return { totalProducts /* etc */ };
  }

  async getSystemAnalytics(): Promise<any> {
    // System metrics, perhaps from performance logs
    return { uptime: 99.99 /* mock or real */ };
  }

  async getRestockSubscribers(productId: string): Promise<RestockSubscription[]> {
    return await db.select().from(restockSubscriptions).where(eq(restockSubscriptions.productId, productId));
  }
}

export const storage = new DbStorage();
export const database = storage;