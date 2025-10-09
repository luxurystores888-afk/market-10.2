/**
 * ⚙️ ENVIRONMENT VALIDATOR
 * Checks all required environment variables on startup
 * Prevents runtime errors from missing config!
 */

import { logger } from './logger';

interface EnvConfig {
  required: string[];
  optional: string[];
  sensitive: string[];
}

const ENV_CONFIG: EnvConfig = {
  required: [
    'DATABASE_URL',
    'JWT_SECRET',
    'NODE_ENV'
  ],
  optional: [
    'PORT',
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'STRIPE_SECRET_KEY',
    'SENDGRID_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'REDIS_URL'
  ],
  sensitive: [
    'JWT_SECRET',
    'DATABASE_URL',
    'STRIPE_SECRET_KEY',
    'OPENAI_API_KEY'
  ]
};

class EnvironmentValidator {
  validate(): boolean {
    logger.info('🔍 Validating environment variables...');
    
    let isValid = true;
    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const key of ENV_CONFIG.required) {
      if (!process.env[key]) {
        missing.push(key);
        isValid = false;
      }
    }

    // Report missing required variables
    if (missing.length > 0) {
      logger.error('❌ Missing required environment variables:', missing);
      logger.error('💡 Add these to your .env file!');
      return false;
    }

    // Check optional but recommended
    for (const key of ENV_CONFIG.optional) {
      if (!process.env[key]) {
        warnings.push(key);
      }
    }

    // Report warnings
    if (warnings.length > 0) {
      logger.warn('⚠️  Optional environment variables not set:', warnings);
      logger.warn('💡 Some features may be limited without these');
    }

    // Security checks
    this.validateSecurity();

    logger.success('✅ Environment validation complete!');
    return true;
  }

  private validateSecurity() {
    // Check JWT secret strength
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      logger.warn('⚠️  JWT_SECRET is too short! Use at least 32 characters');
      logger.warn('💡 Generate with: openssl rand -base64 32');
    }

    // Check if using default values
    if (jwtSecret === 'your-secret-key-change-this') {
      logger.error('❌ JWT_SECRET is still default! CHANGE IT NOW!');
    }

    // Check production mode
    if (process.env.NODE_ENV === 'production') {
      logger.info('🔒 Production mode - Extra security checks enabled');
      
      // Ensure HTTPS in production
      if (!process.env.FORCE_HTTPS) {
        logger.warn('⚠️  Consider enabling FORCE_HTTPS in production');
      }
    }
  }

  logConfig() {
    logger.info('📋 Environment Configuration:');
    logger.info(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`   PORT: ${process.env.PORT || '3001'}`);
    logger.info(`   DATABASE: ${process.env.DATABASE_URL ? '✅ Configured' : '❌ Missing'}`);
    logger.info(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
    logger.info(`   STRIPE: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '⚠️  Not set'}`);
    logger.info(`   OPENAI: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '⚠️  Not set'}`);
    logger.info(`   EMAIL: ${process.env.SENDGRID_API_KEY ? '✅ Configured' : '⚠️  Not set'}`);
  }
}

export const envValidator = new EnvironmentValidator();

// Run validation on import
if (!envValidator.validate()) {
  logger.error('❌ Environment validation failed! Fix .env file before starting!');
  process.exit(1);
}

export default envValidator;
