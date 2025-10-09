import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { DatabaseService } from './database.js';
import { AIService } from './ai.js';
import { chatRooms, chatMembers, chatMessages, documents, documentVersions, users } from '../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';

// Message schemas
const chatMessageSchema = z.object({
  roomId: z.string().uuid(),
  content: z.string().min(1).max(10000),
  type: z.enum(['text', 'image', 'file', 'system']).default('text'),
  replyToId: z.string().uuid().optional(),
  attachments: z.array(z.any()).optional(),
});

const documentUpdateSchema = z.object({
  documentId: z.string().uuid(),
  content: z.string(),
  cursorPosition: z.number().optional(),
  selection: z.object({
    start: z.number(),
    end: z.number(),
  }).optional(),
});

const collaboratorCursorSchema = z.object({
  documentId: z.string().uuid(),
  position: z.number(),
  selection: z.object({
    start: z.number(),
    end: z.number(),
  }).optional(),
});

// Types
export interface SocketUser {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  rooms: Set<string>;
  documents: Set<string>;
}

export interface RoomUser {
  userId: string;
  username: string;
  avatar?: string;
  status: 'online' | 'away' | 'typing';
  lastSeen: Date;
}

export interface DocumentCollaborator {
  userId: string;
  username: string;
  avatar?: string;
  cursorPosition: number;
  cursorColor: string;
  selection?: { start: number; end: number };
}

export interface TypingStatus {
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

export class SocketService {
  private io: SocketIOServer | null = null;
  private db: DatabaseService | null = null;
  private ai: AIService | null = null;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private roomUsers: Map<string, Map<string, RoomUser>> = new Map();
  private documentCollaborators: Map<string, Map<string, DocumentCollaborator>> = new Map();
  private typingStatus: Map<string, Map<string, TypingStatus>> = new Map();

  // Cursor colors for collaborators
  private cursorColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E5'
  ];

  public initialize(io: SocketIOServer): void {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
    console.log('✅ Socket service initialized');
  }

  public setDatabaseService(db: DatabaseService): void {
    this.db = db;
  }

  public setAIService(ai: AIService): void {
    this.ai = ai;
  }

  private setupMiddleware(): void {
    if (!this.io) return;

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication required'));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        socket.data.userId = decoded.sub;
        socket.data.user = await this.getUserData(decoded.sub);

        next();
      } catch (error) {
        next(new Error('Invalid authentication'));
      }
    });
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);

      // Chat events
      socket.on('chat:join_room', (data) => this.handleJoinRoom(socket, data));
      socket.on('chat:leave_room', (data) => this.handleLeaveRoom(socket, data));
      socket.on('chat:send_message', (data) => this.handleSendMessage(socket, data));
      socket.on('chat:typing', (data) => this.handleTyping(socket, data));
      socket.on('chat:mark_read', (data) => this.handleMarkRead(socket, data));
      socket.on('chat:edit_message', (data) => this.handleEditMessage(socket, data));
      socket.on('chat:delete_message', (data) => this.handleDeleteMessage(socket, data));
      socket.on('chat:react', (data) => this.handleReaction(socket, data));

      // Document collaboration events
      socket.on('doc:join', (data) => this.handleJoinDocument(socket, data));
      socket.on('doc:leave', (data) => this.handleLeaveDocument(socket, data));
      socket.on('doc:update', (data) => this.handleDocumentUpdate(socket, data));
      socket.on('doc:cursor', (data) => this.handleCursorUpdate(socket, data));
      socket.on('doc:save', (data) => this.handleSaveDocument(socket, data));
      socket.on('doc:version', (data) => this.handleCreateVersion(socket, data));

      // AI Assistant events
      socket.on('ai:chat', (data) => this.handleAIChat(socket, data));
      socket.on('ai:complete', (data) => this.handleAIComplete(socket, data));
      socket.on('ai:translate', (data) => this.handleAITranslate(socket, data));

      // Voice/Video call events
      socket.on('call:initiate', (data) => this.handleCallInitiate(socket, data));
      socket.on('call:answer', (data) => this.handleCallAnswer(socket, data));
      socket.on('call:reject', (data) => this.handleCallReject(socket, data));
      socket.on('call:end', (data) => this.handleCallEnd(socket, data));
      socket.on('call:ice_candidate', (data) => this.handleICECandidate(socket, data));

      // Presence events
      socket.on('presence:update', (data) => this.handlePresenceUpdate(socket, data));
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  // Connection handling
  private async handleConnection(socket: Socket): Promise<void> {
    const userId = socket.data.userId;
    const user = socket.data.user;

    console.log(`👤 User connected: ${user.username} (${userId})`);

    // Create socket user
    const socketUser: SocketUser = {
      id: socket.id,
      userId,
      username: user.username,
      avatar: user.avatar,
      rooms: new Set(),
      documents: new Set(),
    };

    this.connectedUsers.set(socket.id, socketUser);

    // Send initial data
    socket.emit('connected', {
      userId,
      socketId: socket.id,
      user: {
        id: userId,
        username: user.username,
        avatar: user.avatar,
      },
    });

    // Update user's online status
    await this.updateUserOnlineStatus(userId, true);
  }

  // Chat room handling
  private async handleJoinRoom(socket: Socket, data: any): Promise<void> {
    try {
      const { roomId } = data;
      const userId = socket.data.userId;
      const user = this.connectedUsers.get(socket.id);

      if (!user || !this.db) return;

      // Verify user is member of the room
      const [membership] = await this.db.getDb()
        .select()
        .from(chatMembers)
        .where(
          and(
            eq(chatMembers.roomId, roomId),
            eq(chatMembers.userId, userId)
          )
        )
        .limit(1);

      if (!membership) {
        socket.emit('error', { message: 'Not a member of this room' });
        return;
      }

      // Join socket room
      socket.join(roomId);
      user.rooms.add(roomId);

      // Add to room users
      if (!this.roomUsers.has(roomId)) {
        this.roomUsers.set(roomId, new Map());
      }

      const roomUser: RoomUser = {
        userId,
        username: user.username,
        avatar: user.avatar,
        status: 'online',
        lastSeen: new Date(),
      };

      this.roomUsers.get(roomId)!.set(userId, roomUser);

      // Get recent messages
      const recentMessages = await this.db.getDb()
        .select({
          id: chatMessages.id,
          roomId: chatMessages.roomId,
          senderId: chatMessages.senderId,
          content: chatMessages.content,
          type: chatMessages.type,
          replyToId: chatMessages.replyToId,
          isEdited: chatMessages.isEdited,
          isDeleted: chatMessages.isDeleted,
          isPinned: chatMessages.isPinned,
          attachments: chatMessages.attachments,
          reactions: chatMessages.reactions,
          createdAt: chatMessages.createdAt,
          sender: {
            id: users.id,
            username: users.username,
            avatar: users.avatar,
          },
        })
        .from(chatMessages)
        .leftJoin(users, eq(chatMessages.senderId, users.id))
        .where(eq(chatMessages.roomId, roomId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(50);

      // Send room data to user
      socket.emit('chat:room_joined', {
        roomId,
        messages: recentMessages.reverse(),
        users: Array.from(this.roomUsers.get(roomId)!.values()),
      });

      // Notify others
      socket.to(roomId).emit('chat:user_joined', {
        roomId,
        user: roomUser,
      });

      // Update last read
      await this.db.getDb()
        .update(chatMembers)
        .set({ lastReadAt: new Date() })
        .where(
          and(
            eq(chatMembers.roomId, roomId),
            eq(chatMembers.userId, userId)
          )
        );

    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  private async handleLeaveRoom(socket: Socket, data: any): Promise<void> {
    const { roomId } = data;
    const userId = socket.data.userId;
    const user = this.connectedUsers.get(socket.id);

    if (!user) return;

    // Leave socket room
    socket.leave(roomId);
    user.rooms.delete(roomId);

    // Remove from room users
    const roomUsersMap = this.roomUsers.get(roomId);
    if (roomUsersMap) {
      roomUsersMap.delete(userId);
      
      // Notify others
      socket.to(roomId).emit('chat:user_left', {
        roomId,
        userId,
      });
    }
  }

  private async handleSendMessage(socket: Socket, data: any): Promise<void> {
    try {
      const validatedData = chatMessageSchema.parse(data);
      const userId = socket.data.userId;
      const user = this.connectedUsers.get(socket.id);

      if (!user || !this.db) return;

      // Verify user is in the room
      if (!user.rooms.has(validatedData.roomId)) {
        socket.emit('error', { message: 'Not in this room' });
        return;
      }

      // Save message to database
      const [message] = await this.db.getDb()
        .insert(chatMessages)
        .values({
          roomId: validatedData.roomId,
          senderId: userId,
          content: validatedData.content,
          type: validatedData.type,
          replyToId: validatedData.replyToId,
          attachments: validatedData.attachments,
          reactions: {},
        })
        .returning();

      // Get sender info
      const messageWithSender = {
        ...message,
        sender: {
          id: userId,
          username: user.username,
          avatar: user.avatar,
        },
      };

      // Send to all users in room
      this.io?.to(validatedData.roomId).emit('chat:message', messageWithSender);

      // AI features
      if (this.ai) {
        // Analyze sentiment
        const sentiment = await this.ai.analyzeSentiment(validatedData.content);
        
        // Auto-translate for users with different languages
        await this.autoTranslateMessage(message.id, validatedData.content, validatedData.roomId);

        // Update message with AI data
        await this.db.getDb()
          .update(chatMessages)
          .set({
            sentiment: sentiment.score,
            language: 'en', // Detect language in real implementation
          })
          .where(eq(chatMessages.id, message.id));
      }

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  private async handleTyping(socket: Socket, data: any): Promise<void> {
    const { roomId, isTyping } = data;
    const userId = socket.data.userId;

    // Update typing status
    if (!this.typingStatus.has(roomId)) {
      this.typingStatus.set(roomId, new Map());
    }

    const roomTyping = this.typingStatus.get(roomId)!;
    
    if (isTyping) {
      roomTyping.set(userId, {
        userId,
        isTyping: true,
        timestamp: new Date(),
      });
    } else {
      roomTyping.delete(userId);
    }

    // Notify others in room
    socket.to(roomId).emit('chat:typing_status', {
      roomId,
      userId,
      isTyping,
    });
  }

  // Document collaboration handling
  private async handleJoinDocument(socket: Socket, data: any): Promise<void> {
    try {
      const { documentId } = data;
      const userId = socket.data.userId;
      const user = this.connectedUsers.get(socket.id);

      if (!user || !this.db) return;

      // Verify user has access to document
      const [document] = await this.db.getDb()
        .select()
        .from(documents)
        .where(eq(documents.id, documentId))
        .limit(1);

      if (!document) {
        socket.emit('error', { message: 'Document not found' });
        return;
      }

      // Check permissions
      const hasAccess = document.ownerId === userId || 
        document.isPublic || 
        (document.collaborators as any)?.includes(userId);

      if (!hasAccess) {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      // Join document room
      socket.join(`doc:${documentId}`);
      user.documents.add(documentId);

      // Add to collaborators
      if (!this.documentCollaborators.has(documentId)) {
        this.documentCollaborators.set(documentId, new Map());
      }

      const collaborator: DocumentCollaborator = {
        userId,
        username: user.username,
        avatar: user.avatar,
        cursorPosition: 0,
        cursorColor: this.getRandomCursorColor(),
      };

      this.documentCollaborators.get(documentId)!.set(userId, collaborator);

      // Send document data
      socket.emit('doc:joined', {
        documentId,
        document: {
          id: document.id,
          title: document.title,
          content: document.content,
          type: document.type,
          version: document.version,
        },
        collaborators: Array.from(this.documentCollaborators.get(documentId)!.values()),
      });

      // Notify others
      socket.to(`doc:${documentId}`).emit('doc:collaborator_joined', {
        documentId,
        collaborator,
      });

    } catch (error) {
      console.error('Error joining document:', error);
      socket.emit('error', { message: 'Failed to join document' });
    }
  }

  private async handleDocumentUpdate(socket: Socket, data: any): Promise<void> {
    try {
      const validatedData = documentUpdateSchema.parse(data);
      const userId = socket.data.userId;
      const { documentId, content, cursorPosition, selection } = validatedData;

      if (!this.db) return;

      // Update document in database
      await this.db.getDb()
        .update(documents)
        .set({
          content,
          lastEditedBy: userId,
          lastEditedAt: new Date(),
          version: sql`version + 1`,
        })
        .where(eq(documents.id, documentId));

      // Broadcast to other collaborators
      socket.to(`doc:${documentId}`).emit('doc:update', {
        documentId,
        content,
        userId,
        cursorPosition,
        selection,
      });

      // Update collaborator cursor
      const collaborators = this.documentCollaborators.get(documentId);
      if (collaborators && cursorPosition !== undefined) {
        const collaborator = collaborators.get(userId);
        if (collaborator) {
          collaborator.cursorPosition = cursorPosition;
          if (selection) {
            collaborator.selection = selection;
          }
        }
      }

    } catch (error) {
      console.error('Error updating document:', error);
      socket.emit('error', { message: 'Failed to update document' });
    }
  }

  private async handleCursorUpdate(socket: Socket, data: any): Promise<void> {
    try {
      const validatedData = collaboratorCursorSchema.parse(data);
      const userId = socket.data.userId;
      const { documentId, position, selection } = validatedData;

      // Update cursor position
      const collaborators = this.documentCollaborators.get(documentId);
      if (collaborators) {
        const collaborator = collaborators.get(userId);
        if (collaborator) {
          collaborator.cursorPosition = position;
          if (selection) {
            collaborator.selection = selection;
          }

          // Broadcast to others
          socket.to(`doc:${documentId}`).emit('doc:cursor_update', {
            documentId,
            userId,
            position,
            selection,
          });
        }
      }
    } catch (error) {
      console.error('Error updating cursor:', error);
    }
  }

  private async handleSaveDocument(socket: Socket, data: any): Promise<void> {
    try {
      const { documentId, message } = data;
      const userId = socket.data.userId;

      if (!this.db) return;

      // Get current document
      const [document] = await this.db.getDb()
        .select()
        .from(documents)
        .where(eq(documents.id, documentId))
        .limit(1);

      if (!document) {
        socket.emit('error', { message: 'Document not found' });
        return;
      }

      // Create version
      await this.db.getDb()
        .insert(documentVersions)
        .values({
          documentId,
          version: document.version || 1,
          content: document.content || '',
          authorId: userId,
          message: message || 'Manual save',
        });

      // Notify all collaborators
      this.io?.to(`doc:${documentId}`).emit('doc:saved', {
        documentId,
        version: document.version,
        savedBy: userId,
        timestamp: new Date(),
      });

    } catch (error) {
      console.error('Error saving document:', error);
      socket.emit('error', { message: 'Failed to save document' });
    }
  }

  // AI Assistant handling
  private async handleAIChat(socket: Socket, data: any): Promise<void> {
    try {
      const { roomId, prompt, conversationId } = data;
      const userId = socket.data.userId;

      if (!this.ai || !this.db) return;

      // Generate AI response
      const response = await this.ai.chatCompletion([
        { role: 'system', content: 'You are a helpful assistant in a chat room.' },
        { role: 'user', content: prompt }
      ]);

      // Save AI message
      const [aiMessage] = await this.db.getDb()
        .insert(chatMessages)
        .values({
          roomId,
          senderId: null, // AI message
          content: response.content,
          type: 'ai',
          isAIGenerated: true,
          aiModel: response.model,
          sentiment: 0,
        })
        .returning();

      // Send to room
      this.io?.to(roomId).emit('chat:message', {
        ...aiMessage,
        sender: {
          id: 'ai-assistant',
          username: 'AI Assistant',
          avatar: '/ai-avatar.png',
        },
      });

    } catch (error) {
      console.error('Error with AI chat:', error);
      socket.emit('error', { message: 'AI assistant error' });
    }
  }

  private async handleAITranslate(socket: Socket, data: any): Promise<void> {
    try {
      const { messageId, targetLanguage } = data;

      if (!this.ai || !this.db) return;

      // Get message
      const [message] = await this.db.getDb()
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.id, messageId))
        .limit(1);

      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      // Translate
      const translation = await this.ai.translateText(
        message.content,
        targetLanguage
      );

      // Update message with translation
      const translations = (message.translation as any) || {};
      translations[targetLanguage] = translation.translatedText;

      await this.db.getDb()
        .update(chatMessages)
        .set({ translation: translations })
        .where(eq(chatMessages.id, messageId));

      // Send translation
      socket.emit('chat:translation', {
        messageId,
        targetLanguage,
        translation: translation.translatedText,
      });

    } catch (error) {
      console.error('Error translating message:', error);
      socket.emit('error', { message: 'Translation failed' });
    }
  }

  // Utility methods
  private async getUserData(userId: string): Promise<any> {
    if (!this.db) return null;

    const [user] = await this.db.getDb()
      .select({
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        language: users.language,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user;
  }

  private async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    if (!this.db) return;

    await this.db.getDb()
      .update(users)
      .set({
        metadata: sql`
          jsonb_set(
            COALESCE(metadata, '{}'::jsonb),
            '{isOnline}',
            ${isOnline ? 'true' : 'false'}::jsonb
          )
        `,
      })
      .where(eq(users.id, userId));
  }

  private getRandomCursorColor(): string {
    return this.cursorColors[Math.floor(Math.random() * this.cursorColors.length)];
  }

  private async autoTranslateMessage(messageId: string, content: string, roomId: string): Promise<void> {
    // Get all users in room with different languages
    // Translate message for each language
    // Store translations in message
    // This is a placeholder for the actual implementation
  }

  // Disconnect handling
  private async handleDisconnect(socket: Socket): Promise<void> {
    const userId = socket.data.userId;
    const user = this.connectedUsers.get(socket.id);

    if (!user) return;

    console.log(`👤 User disconnected: ${user.username} (${userId})`);

    // Remove from all rooms
    for (const roomId of user.rooms) {
      const roomUsersMap = this.roomUsers.get(roomId);
      if (roomUsersMap) {
        roomUsersMap.delete(userId);
        
        // Notify others
        socket.to(roomId).emit('chat:user_left', {
          roomId,
          userId,
        });
      }
    }

    // Remove from all documents
    for (const documentId of user.documents) {
      const collaborators = this.documentCollaborators.get(documentId);
      if (collaborators) {
        collaborators.delete(userId);
        
        // Notify others
        socket.to(`doc:${documentId}`).emit('doc:collaborator_left', {
          documentId,
          userId,
        });
      }
    }

    // Remove from connected users
    this.connectedUsers.delete(socket.id);

    // Update user's online status
    await this.updateUserOnlineStatus(userId, false);
  }

  // Voice/Video call handlers (simplified)
  private async handleCallInitiate(socket: Socket, data: any): Promise<void> {
    const { targetUserId, callType } = data;
    const callerId = socket.data.userId;

    // Find target user's socket
    const targetSocket = Array.from(this.connectedUsers.entries())
      .find(([_, user]) => user.userId === targetUserId)?.[0];

    if (targetSocket) {
      this.io?.to(targetSocket).emit('call:incoming', {
        callerId,
        callType,
        callerInfo: socket.data.user,
      });
    }
  }

  private async handleCallAnswer(socket: Socket, data: any): Promise<void> {
    const { callerId, answer } = data;
    
    // Find caller's socket
    const callerSocket = Array.from(this.connectedUsers.entries())
      .find(([_, user]) => user.userId === callerId)?.[0];

    if (callerSocket) {
      this.io?.to(callerSocket).emit('call:answered', {
        userId: socket.data.userId,
        answer,
      });
    }
  }

  private async handleCallReject(socket: Socket, data: any): Promise<void> {
    const { callerId } = data;
    
    // Find caller's socket
    const callerSocket = Array.from(this.connectedUsers.entries())
      .find(([_, user]) => user.userId === callerId)?.[0];

    if (callerSocket) {
      this.io?.to(callerSocket).emit('call:rejected', {
        userId: socket.data.userId,
      });
    }
  }

  private async handleCallEnd(socket: Socket, data: any): Promise<void> {
    const { targetUserId } = data;
    
    // Find target's socket
    const targetSocket = Array.from(this.connectedUsers.entries())
      .find(([_, user]) => user.userId === targetUserId)?.[0];

    if (targetSocket) {
      this.io?.to(targetSocket).emit('call:ended', {
        userId: socket.data.userId,
      });
    }
  }

  private async handleICECandidate(socket: Socket, data: any): Promise<void> {
    const { targetUserId, candidate } = data;
    
    // Find target's socket
    const targetSocket = Array.from(this.connectedUsers.entries())
      .find(([_, user]) => user.userId === targetUserId)?.[0];

    if (targetSocket) {
      this.io?.to(targetSocket).emit('call:ice_candidate', {
        userId: socket.data.userId,
        candidate,
      });
    }
  }

  // Presence handling
  private async handlePresenceUpdate(socket: Socket, data: any): Promise<void> {
    const { status } = data;
    const userId = socket.data.userId;

    // Update presence in all rooms
    const user = this.connectedUsers.get(socket.id);
    if (!user) return;

    for (const roomId of user.rooms) {
      const roomUsersMap = this.roomUsers.get(roomId);
      if (roomUsersMap) {
        const roomUser = roomUsersMap.get(userId);
        if (roomUser) {
          roomUser.status = status;
          roomUser.lastSeen = new Date();

          // Notify others
          socket.to(roomId).emit('chat:presence_update', {
            roomId,
            userId,
            status,
          });
        }
      }
    }
  }

  // Public methods for server-side events
  public broadcastToRoom(roomId: string, event: string, data: any): void {
    this.io?.to(roomId).emit(event, data);
  }

  public broadcastToUser(userId: string, event: string, data: any): void {
    const userSocket = Array.from(this.connectedUsers.entries())
      .find(([_, user]) => user.userId === userId)?.[0];

    if (userSocket) {
      this.io?.to(userSocket).emit(event, data);
    }
  }

  public getOnlineUsers(): Array<{ userId: string; username: string; socketId: string }> {
    return Array.from(this.connectedUsers.values()).map(user => ({
      userId: user.userId,
      username: user.username,
      socketId: user.id,
    }));
  }

  public getRoomUsers(roomId: string): RoomUser[] {
    const roomUsersMap = this.roomUsers.get(roomId);
    return roomUsersMap ? Array.from(roomUsersMap.values()) : [];
  }

  public getDocumentCollaborators(documentId: string): DocumentCollaborator[] {
    const collaborators = this.documentCollaborators.get(documentId);
    return collaborators ? Array.from(collaborators.values()) : [];
  }
}
