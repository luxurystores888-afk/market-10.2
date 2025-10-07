// Use free Twitter API (requires app key)
fetch('https://api.twitter.com/2/tweets', {
  method: 'POST',
  body: JSON.stringify({ text: 'Check out Cyber Mart deals!' }),
  headers: { Authorization: 'Bearer your-token' }
});

// Ping free directories
console.log('Pinging...');