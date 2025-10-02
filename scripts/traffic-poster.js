const Twit = require('twit');

const T = new Twit({ consumer_key: 'your-key', consumer_secret: 'your-secret', access_token: 'your-token', access_token_secret: 'your-secret' });

T.post('statuses/update', { status: 'New cyberpunk deals at Cyber Mart! #Cyberpunk' });
