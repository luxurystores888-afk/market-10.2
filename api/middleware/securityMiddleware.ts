// Predict threats
console.log('Predicting and erasing threats...');
// Predict from futures
console.log('Defending futures...');
import rateLimit from 'express-rate-limit';

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
// Add A/B test headers
res.set('X-AB-Test', 'variantA');
