import cron from 'cron';
import fs from 'fs';
import { execSync } from 'child_process';

const job = new cron.CronJob('0 0 * * *', () => {
  execSync('pg_dump -U postgres cybermart2077 > backup.sql');
  fs.copyFileSync('backup.sql', 'backups/backup_' + new Date().toISOString() + '.sql');
});

job.start();
