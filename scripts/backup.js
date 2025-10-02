const cron = require('cron');
const fs = require('fs');
const { execSync } = require('child_process');

const job = new cron.CronJob('0 0 * * *', () => {
  execSync('pg_dump -U postgres cybermart2077 > backup.sql');
  fs.copyFileSync('backup.sql', 'backups/backup_' + new Date().toISOString() + '.sql');
});

job.start();

setInterval(backup, 3600000); // Hourly

// Migration
fs.copyFile('old.db', 'new.db', err => {});