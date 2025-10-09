/**
 * 📊 REAL-TIME ANALYTICS STREAMER
 * 
 * Streams purchase events to Kafka → Snowflake/ClickHouse
 * Powers Grafana dashboards with real-time data
 */

import { Kafka, Producer } from 'kafkajs';

interface PurchaseEvent {
  eventId: string;
  orderId: string;
  userId?: string;
  productId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  profit: number;
  timestamp: Date;
  metadata: Record<string, any>;
}

export class AnalyticsStreamer {
  private kafka: Kafka;
  private producer: Producer;
  private connected: boolean = false;
  
  constructor() {
    this.kafka = new Kafka({
      clientId: 'cyber-mart-analytics',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      retry: {
        retries: 5
      }
    });
    
    this.producer = this.kafka.producer();
    this.connect();
  }
  
  /**
   * Connect to Kafka
   */
  async connect() {
    try {
      await this.producer.connect();
      this.connected = true;
      console.log('✅ Kafka producer connected');
    } catch (error) {
      console.error('❌ Kafka connection failed:', error);
      this.connected = false;
    }
  }
  
  /**
   * Stream purchase event to Kafka
   */
  async streamPurchase(event: PurchaseEvent) {
    if (!this.connected) {
      console.log('⚠️  Kafka not connected, logging locally');
      console.log('Purchase event:', event);
      return;
    }
    
    try {
      await this.producer.send({
        topic: 'purchase-events',
        messages: [
          {
            key: event.orderId,
            value: JSON.stringify(event),
            timestamp: event.timestamp.getTime().toString()
          }
        ]
      });
      
      console.log(`📊 Streamed purchase event: ${event.orderId} ($${event.amount})`);
      
    } catch (error) {
      console.error('Failed to stream event:', error);
    }
  }
  
  /**
   * Stream custom event
   */
  async streamEvent(topic: string, event: any) {
    if (!this.connected) return;
    
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: event.id || crypto.randomUUID(),
            value: JSON.stringify(event)
          }
        ]
      });
    } catch (error) {
      console.error('Failed to stream custom event:', error);
    }
  }
  
  /**
   * Disconnect
   */
  async disconnect() {
    await this.producer.disconnect();
    this.connected = false;
  }
}

export const analyticsStreamer = new AnalyticsStreamer();

// Auto-stream on every purchase
export async function trackPurchase(orderData: any) {
  const event: PurchaseEvent = {
    eventId: crypto.randomUUID(),
    orderId: orderData.id,
    userId: orderData.userId,
    productId: orderData.productId,
    amount: orderData.totalAmount,
    currency: orderData.currency || 'USD',
    paymentMethod: orderData.paymentMethod,
    profit: orderData.profit || (orderData.totalAmount * 0.3), // Estimated 30% margin
    timestamp: new Date(),
    metadata: orderData.metadata || {}
  };
  
  await analyticsStreamer.streamPurchase(event);
}

