/**
 * 🤖 PM2 ECOSYSTEM CONFIG
 * Professional process management
 * Keeps everything running automatically!
 */

module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'api/index.ts',
      interpreter: 'node',
      interpreter_args: '--loader tsx',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    },
    {
      name: 'automation',
      script: 'scripts/master-automation.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/automation-error.log',
      out_file: './logs/automation-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      cron_restart: '0 0 * * *' // Restart daily at midnight
    }
  ]
};
