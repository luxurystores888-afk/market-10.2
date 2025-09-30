import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  index,
  uniqueIndex,
  foreignKey,
  serial,
  real,
  bigint,
  date,
  time,
  interval,
  point,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'moderator', 'developer']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'canceled', 'past_due', 'unpaid', 'trialing']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded', 'canceled']);
export const paymentMethodEnum = pgEnum('payment_method', ['bitcoin', 'ethereum', 'usdc', 'usdt', 'stripe', 'paypal']);
export const documentTypeEnum = pgEnum('document_type', ['text', 'markdown', 'code', 'presentation', 'spreadsheet']);
export const chatTypeEnum = pgEnum('chat_type', ['private', 'group', 'ai_assistant', 'support']);
export const notificationTypeEnum = pgEnum('notification_type', ['system', 'chat', 'payment', 'ai', 'security']);
export const auditActionEnum = pgEnum('audit_action', ['create', 'read', 'update', 'delete', 'login', 'logout', 'payment']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  avatar: text('avatar'),
  bio: text('bio'),
  role: userRoleEnum('role').default('user').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  passwordHash: varchar('password_hash', { length: 255 }),
  
  // OAuth fields
  googleId: varchar('google_id', { length: 100 }),
  githubId: varchar('github_id', { length: 100 }),
  
  // Privacy settings
  privacyMode: boolean('privacy_mode').default(false),
  dataRetention: boolean('data_retention').default(true),
  analyticsOptOut: boolean('analytics_opt_out').default(false),
  
  // Preferences
  language: varchar('language', { length: 10 }).default('en'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  theme: varchar('theme', { length: 20 }).default('system'),
  
  // Geolocation
  location: point('location'),
  country: varchar('country', { length: 2 }),
  city: varchar('city', { length: 100 }),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  usernameIdx: index('users_username_idx').on(table.username),
  roleIdx: index('users_role_idx').on(table.role),
  locationIdx: index('users_location_idx').on(table.location),
}));

// User Sessions
export const userSessions = pgTable('user_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  refreshToken: varchar('refresh_token', { length: 255 }),
  deviceInfo: jsonb('device_info'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  sessionTokenIdx: uniqueIndex('sessions_token_idx').on(table.sessionToken),
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
  expiresAtIdx: index('sessions_expires_at_idx').on(table.expiresAt),
}));

// Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: varchar('plan_id', { length: 100 }).notNull(),
  status: subscriptionStatusEnum('status').notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  
  // Payment provider data
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 100 }),
  paypalSubscriptionId: varchar('paypal_subscription_id', { length: 100 }),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('subscriptions_user_id_idx').on(table.userId),
  statusIdx: index('subscriptions_status_idx').on(table.status),
  planIdIdx: index('subscriptions_plan_id_idx').on(table.planId),
}));

// Payments
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  status: paymentStatusEnum('status').notNull(),
  method: paymentMethodEnum('method').notNull(),
  
  // Transaction details
  transactionId: varchar('transaction_id', { length: 255 }),
  blockchainTxHash: varchar('blockchain_tx_hash', { length: 255 }),
  confirmations: integer('confirmations').default(0),
  
  // Provider data
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 100 }),
  paypalPaymentId: varchar('paypal_payment_id', { length: 100 }),
  
  // Crypto details
  walletAddress: varchar('wallet_address', { length: 255 }),
  network: varchar('network', { length: 50 }),
  
  // Metadata
  metadata: jsonb('metadata'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('payments_user_id_idx').on(table.userId),
  statusIdx: index('payments_status_idx').on(table.status),
  methodIdx: index('payments_method_idx').on(table.method),
  transactionIdIdx: index('payments_transaction_id_idx').on(table.transactionId),
  blockchainTxHashIdx: index('payments_blockchain_tx_hash_idx').on(table.blockchainTxHash),
}));

// Documents (for collaborative editing)
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  type: documentTypeEnum('type').default('text').notNull(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  isPublic: boolean('is_public').default(false),
  isTemplate: boolean('is_template').default(false),
  parentId: uuid('parent_id').references(() => documents.id),
  
  // Collaboration
  collaborators: jsonb('collaborators'), // Array of user IDs with permissions
  version: integer('version').default(1),
  lastEditedBy: uuid('last_edited_by').references(() => users.id),
  lastEditedAt: timestamp('last_edited_at'),
  
  // AI features
  aiSummary: text('ai_summary'),
  aiTags: jsonb('ai_tags'),
  sentiment: real('sentiment'),
  readingTime: integer('reading_time'), // in minutes
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  ownerIdIdx: index('documents_owner_id_idx').on(table.ownerId),
  typeIdx: index('documents_type_idx').on(table.type),
  isPublicIdx: index('documents_is_public_idx').on(table.isPublic),
  parentIdIdx: index('documents_parent_id_idx').on(table.parentId),
  titleIdx: index('documents_title_idx').on(table.title),
}));

// Document Versions (for version control)
export const documentVersions = pgTable('document_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  content: text('content').notNull(),
  changes: jsonb('changes'), // diff information
  authorId: uuid('author_id').notNull().references(() => users.id),
  message: text('message'), // commit message
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  documentIdIdx: index('document_versions_document_id_idx').on(table.documentId),
  versionIdx: index('document_versions_version_idx').on(table.version),
  authorIdIdx: index('document_versions_author_id_idx').on(table.authorId),
}));

// Chat Rooms
export const chatRooms = pgTable('chat_rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  type: chatTypeEnum('type').default('private').notNull(),
  ownerId: uuid('owner_id').references(() => users.id),
  isActive: boolean('is_active').default(true),
  maxMembers: integer('max_members').default(100),
  
  // AI assistant configuration
  aiAssistantEnabled: boolean('ai_assistant_enabled').default(false),
  aiModel: varchar('ai_model', { length: 50 }),
  aiPersonality: text('ai_personality'),
  
  // Settings
  settings: jsonb('settings'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  typeIdx: index('chat_rooms_type_idx').on(table.type),
  ownerIdIdx: index('chat_rooms_owner_id_idx').on(table.ownerId),
  isActiveIdx: index('chat_rooms_is_active_idx').on(table.isActive),
}));

// Chat Members
export const chatMembers = pgTable('chat_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  roomId: uuid('room_id').notNull().references(() => chatRooms.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).default('member'), // member, admin, moderator
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  lastReadAt: timestamp('last_read_at'),
  isMuted: boolean('is_muted').default(false),
  isBlocked: boolean('is_blocked').default(false),
  
  // Permissions
  canInvite: boolean('can_invite').default(false),
  canModerate: boolean('can_moderate').default(false),
  canManageRoom: boolean('can_manage_room').default(false),
}, (table) => ({
  roomIdIdx: index('chat_members_room_id_idx').on(table.roomId),
  userIdIdx: index('chat_members_user_id_idx').on(table.userId),
  roleIdx: index('chat_members_role_idx').on(table.role),
  uniqueMembership: uniqueIndex('chat_members_room_user_idx').on(table.roomId, table.userId),
}));

// Chat Messages
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  roomId: uuid('room_id').notNull().references(() => chatRooms.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'set null' }),
  content: text('content').notNull(),
  type: varchar('type', { length: 20 }).default('text'), // text, image, file, system, ai
  
  // Message features
  replyToId: uuid('reply_to_id').references(() => chatMessages.id),
  isEdited: boolean('is_edited').default(false),
  isDeleted: boolean('is_deleted').default(false),
  isPinned: boolean('is_pinned').default(false),
  
  // AI features
  isAIGenerated: boolean('is_ai_generated').default(false),
  aiModel: varchar('ai_model', { length: 50 }),
  sentiment: real('sentiment'),
  language: varchar('language', { length: 10 }),
  translation: jsonb('translation'), // translations to different languages
  
  // Attachments
  attachments: jsonb('attachments'),
  
  // Reactions
  reactions: jsonb('reactions'), // emoji reactions with user counts
  
  // Metadata
  metadata: jsonb('metadata'),
  editedAt: timestamp('edited_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  roomIdIdx: index('chat_messages_room_id_idx').on(table.roomId),
  senderIdIdx: index('chat_messages_sender_id_idx').on(table.senderId),
  typeIdx: index('chat_messages_type_idx').on(table.type),
  createdAtIdx: index('chat_messages_created_at_idx').on(table.createdAt),
  replyToIdIdx: index('chat_messages_reply_to_id_idx').on(table.replyToId),
}));

// AI Conversations
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }),
  model: varchar('model', { length: 50 }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // openai, anthropic, google
  
  // Configuration
  systemPrompt: text('system_prompt'),
  temperature: real('temperature').default(0.7),
  maxTokens: integer('max_tokens').default(1000),
  
  // Conversation state
  isActive: boolean('is_active').default(true),
  messageCount: integer('message_count').default(0),
  totalTokensUsed: integer('total_tokens_used').default(0),
  
  // Cost tracking
  totalCost: decimal('total_cost', { precision: 10, scale: 6 }).default('0'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('ai_conversations_user_id_idx').on(table.userId),
  modelIdx: index('ai_conversations_model_idx').on(table.model),
  providerIdx: index('ai_conversations_provider_idx').on(table.provider),
  isActiveIdx: index('ai_conversations_is_active_idx').on(table.isActive),
}));

// AI Messages
export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').notNull().references(() => aiConversations.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(), // user, assistant, system
  content: text('content').notNull(),
  
  // Token usage
  promptTokens: integer('prompt_tokens'),
  completionTokens: integer('completion_tokens'),
  totalTokens: integer('total_tokens'),
  
  // Cost
  cost: decimal('cost', { precision: 10, scale: 6 }),
  
  // AI model response metadata
  model: varchar('model', { length: 50 }),
  finishReason: varchar('finish_reason', { length: 50 }),
  responseTime: integer('response_time'), // in milliseconds
  
  // Function calling
  functionCall: jsonb('function_call'),
  toolCalls: jsonb('tool_calls'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  conversationIdIdx: index('ai_messages_conversation_id_idx').on(table.conversationId),
  roleIdx: index('ai_messages_role_idx').on(table.role),
  createdAtIdx: index('ai_messages_created_at_idx').on(table.createdAt),
}));

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: notificationTypeEnum('type').notNull(),
  
  // Status
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  
  // Action
  actionUrl: varchar('action_url', { length: 500 }),
  actionLabel: varchar('action_label', { length: 100 }),
  
  // Metadata
  metadata: jsonb('metadata'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('notifications_user_id_idx').on(table.userId),
  typeIdx: index('notifications_type_idx').on(table.type),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
  expiresAtIdx: index('notifications_expires_at_idx').on(table.expiresAt),
}));

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: auditActionEnum('action').notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  resourceId: varchar('resource_id', { length: 255 }),
  
  // Request details
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  
  // Changes
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  resourceIdx: index('audit_logs_resource_idx').on(table.resource),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}));

// Analytics Events
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  sessionId: varchar('session_id', { length: 255 }),
  eventName: varchar('event_name', { length: 100 }).notNull(),
  
  // Event properties
  properties: jsonb('properties'),
  
  // Device/browser info
  deviceType: varchar('device_type', { length: 50 }),
  browser: varchar('browser', { length: 50 }),
  os: varchar('os', { length: 50 }),
  
  // Location
  country: varchar('country', { length: 2 }),
  region: varchar('region', { length: 100 }),
  city: varchar('city', { length: 100 }),
  
  // UTM parameters
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  utmTerm: varchar('utm_term', { length: 255 }),
  utmContent: varchar('utm_content', { length: 255 }),
  
  // Timing
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('analytics_events_user_id_idx').on(table.userId),
  eventNameIdx: index('analytics_events_event_name_idx').on(table.eventName),
  timestampIdx: index('analytics_events_timestamp_idx').on(table.timestamp),
  sessionIdIdx: index('analytics_events_session_id_idx').on(table.sessionId),
}));

// Feature Flags
export const featureFlags = pgTable('feature_flags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  isEnabled: boolean('is_enabled').default(false),
  
  // Targeting
  userPercentage: integer('user_percentage').default(0), // 0-100
  userTargeting: jsonb('user_targeting'), // rules for user targeting
  
  // A/B testing
  variants: jsonb('variants'), // different variants for A/B testing
  
  // Metadata
  metadata: jsonb('metadata'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  nameIdx: uniqueIndex('feature_flags_name_idx').on(table.name),
  isEnabledIdx: index('feature_flags_is_enabled_idx').on(table.isEnabled),
}));

// File Uploads
export const fileUploads = pgTable('file_uploads', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: bigint('size', { mode: 'number' }).notNull(),
  
  // Storage
  storageProvider: varchar('storage_provider', { length: 50 }).default('local'),
  storagePath: varchar('storage_path', { length: 500 }).notNull(),
  url: varchar('url', { length: 500 }),
  
  // AI processing
  isProcessed: boolean('is_processed').default(false),
  aiTags: jsonb('ai_tags'),
  aiDescription: text('ai_description'),
  ocrText: text('ocr_text'),
  
  // Image specific
  width: integer('width'),
  height: integer('height'),
  
  // Metadata
  metadata: jsonb('metadata'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('file_uploads_user_id_idx').on(table.userId),
  mimeTypeIdx: index('file_uploads_mime_type_idx').on(table.mimeType),
  createdAtIdx: index('file_uploads_created_at_idx').on(table.createdAt),
  expiresAtIdx: index('file_uploads_expires_at_idx').on(table.expiresAt),
}));

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(userSessions),
  subscriptions: many(subscriptions),
  payments: many(payments),
  documents: many(documents),
  chatMembers: many(chatMembers),
  sentMessages: many(chatMessages),
  aiConversations: many(aiConversations),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  fileUploads: many(fileUploads),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  owner: one(users, {
    fields: [documents.ownerId],
    references: [users.id],
  }),
  lastEditedByUser: one(users, {
    fields: [documents.lastEditedBy],
    references: [users.id],
  }),
  parent: one(documents, {
    fields: [documents.parentId],
    references: [documents.id],
  }),
  children: many(documents),
  versions: many(documentVersions),
}));

export const chatRoomsRelations = relations(chatRooms, ({ one, many }) => ({
  owner: one(users, {
    fields: [chatRooms.ownerId],
    references: [users.id],
  }),
  members: many(chatMembers),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  room: one(chatRooms, {
    fields: [chatMessages.roomId],
    references: [chatRooms.id],
  }),
  sender: one(users, {
    fields: [chatMessages.senderId],
    references: [users.id],
  }),
  replyTo: one(chatMessages, {
    fields: [chatMessages.replyToId],
    references: [chatMessages.id],
  }),
}));

export const aiConversationsRelations = relations(aiConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [aiConversations.userId],
    references: [users.id],
  }),
  messages: many(aiMessages),
}));

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, {
    fields: [aiMessages.conversationId],
    references: [aiConversations.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  payments: many(payments),
}));
