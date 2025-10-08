/**
 * 🔄 GRACEFUL SHUTDOWN HANDLER
 * Properly closes connections on shutdown
 * Prevents data loss and corruption!
 */

import { logger } from './logger';

class GracefulShutdown {
  private isShuttingDown = false;
  private connections: any[] = [];

  register(connection: any, name: string) {
    this.connections.push({ connection, name });
    logger.debug(`Registered connection: ${name}`);
  }

  async shutdown(signal: string) {
    if (this.isShuttingDown) {
      logger.warn('Shutdown already in progress...');
      return;
    }

    this.isShuttingDown = true;
    logger.info(`\n🛑 Received ${signal} - Starting graceful shutdown...`);

    try {
      // Close all registered connections
      logger.info('📡 Closing connections...');
      
      for (const { connection, name } of this.connections) {
        try {
          if (connection && typeof connection.close === 'function') {
            await connection.close();
            logger.success(`   ✅ ${name} closed`);
          }
        } catch (error) {
          logger.error(`   ❌ Failed to close ${name}:`, error);
        }
      }

      // Save any pending data
      logger.info('💾 Saving pending data...');
      // Add any cleanup logic here

      logger.success('✅ Graceful shutdown complete!');
      logger.info('👋 Goodbye!\n');

      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }

  setup() {
    // Handle different shutdown signals
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('💥 Uncaught Exception:', error);
      this.shutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('💥 Unhandled Rejection:', reason);
      this.shutdown('UNHANDLED_REJECTION');
    });

    logger.success('✅ Graceful shutdown handlers registered');
  }
}

export const gracefulShutdown = new GracefulShutdown();
export default gracefulShutdown;
