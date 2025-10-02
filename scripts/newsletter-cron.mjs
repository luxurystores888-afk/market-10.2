import cron from 'cron';

const job = new cron.CronJob('0 0 * * 0', () => {
  sendNewsletter('Weekly Cyber Deals', '<h1>Check out this week\'s offers!</h1>');
});

job.start();
