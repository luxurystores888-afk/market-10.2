const Twit = require('twit');

const T = new Twit({ consumer_key: 'your-key', consumer_secret: 'your-secret', access_token: 'your-token', access_token_secret: 'your-secret' });

// Post to mock endpoints
console.log('Posting...');
