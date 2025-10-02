import { execSync } from 'child_process';

console.log('Automating everything...');

execSync('node scripts/generate-sitemap.js');
execSync('npm run build');
execSync('npm run start');
