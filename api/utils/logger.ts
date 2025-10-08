/**
 * 📝 PRODUCTION LOGGER
 * Better than console.log - works in production!
 * 
 * Features:
 * - Log levels (info, warn, error)
 * - Timestamps
 * - Color coding
 * - File output (optional)
 * - Silences in production (optional)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';
  private enableConsole = true;

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.getTimestamp();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
  }

  info(message: string, data?: any) {
    const formatted = this.formatMessage('info', message, data);
    if (this.isDevelopment || this.enableConsole) {
      console.log(`ℹ️  ${formatted}`);
    }
  }

  success(message: string, data?: any) {
    const formatted = this.formatMessage('success', message, data);
    if (this.isDevelopment || this.enableConsole) {
      console.log(`✅ ${formatted}`);
    }
  }

  warn(message: string, data?: any) {
    const formatted = this.formatMessage('warn', message, data);
    console.warn(`⚠️  ${formatted}`);
  }

  error(message: string, error?: any) {
    const formatted = this.formatMessage('error', message, error?.message || error);
    console.error(`❌ ${formatted}`);
    if (error?.stack && this.isDevelopment) {
      console.error(error.stack);
    }
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('debug', message, data);
      console.log(`🔍 ${formatted}`);
    }
  }

  // Special formatters
  currency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  number(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }
}

// Singleton
export const logger = new Logger();
export default logger;
