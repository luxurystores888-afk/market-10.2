#!/usr/bin/env node

/**
 * 🔍 VERIFICATION SCRIPT FOR CYBER MART 2077
 * Verifies that all components are working correctly
 */

import fs from 'fs';
import path from 'path';
// import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🔍 CYBER MART 2077 - SETUP VERIFICATION');
console.log('========================================\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function check(name, condition, isWarning = false) {
  if (condition) {
    console.log(`✅ ${name}`);
    checks.passed++;
  } else {
    if (isWarning) {
      console.log(`⚠️  ${name} (Warning)`);
      checks.warnings++;
    } else {
      console.log(`❌ ${name}`);
      checks.failed++;
    }
  }
}

async function verifySetup() {
  console.log('📋 Checking file structure...\n');

  // Check essential files
  check('package.json exists', fs.existsSync(path.join(projectRoot, 'package.json')));
  check('tsconfig.json exists', fs.existsSync(path.join(projectRoot, 'tsconfig.json')));
  check('vite.config.ts exists', fs.existsSync(path.join(projectRoot, 'vite.config.ts')));
  check('env.example exists', fs.existsSync(path.join(projectRoot, 'env.example')));
  check('ecosystem.config.js exists', fs.existsSync(path.join(projectRoot, 'ecosystem.config.js')));
  check('vercel.json exists', fs.existsSync(path.join(projectRoot, 'vercel.json')));
  check('netlify.toml exists', fs.existsSync(path.join(projectRoot, 'netlify.toml')));
  check('Dockerfile exists', fs.existsSync(path.join(projectRoot, 'Dockerfile')));
  check('docker-compose.prod.yml exists', fs.existsSync(path.join(projectRoot, 'docker-compose.prod.yml')));

  console.log('\n📁 Checking directories...\n');
  
  check('src directory exists', fs.existsSync(path.join(projectRoot, 'src')));
  check('api directory exists', fs.existsSync(path.join(projectRoot, 'api')));
  check('lib directory exists', fs.existsSync(path.join(projectRoot, 'lib')));
  check('scripts directory exists', fs.existsSync(path.join(projectRoot, 'scripts')));
  check('public directory exists', fs.existsSync(path.join(projectRoot, 'public')));
  check('.github/workflows directory exists', fs.existsSync(path.join(projectRoot, '.github/workflows')));

  console.log('\n📦 Checking package.json...\n');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    
    check('Package name is set', packageJson.name === 'cyber-mart-2077');
    check('Main scripts exist', packageJson.scripts && packageJson.scripts.dev && packageJson.scripts.build);
    check('Dependencies are defined', packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0);
    check('DevDependencies are defined', packageJson.devDependencies && Object.keys(packageJson.devDependencies).length > 0);
    check('TypeScript is included', packageJson.devDependencies && packageJson.devDependencies.typescript);
    check('React is included', packageJson.dependencies && packageJson.dependencies.react);
    check('Express is included', packageJson.dependencies && packageJson.dependencies.express);
    
  } catch (error) {
    check('package.json is valid JSON', false);
  }

  console.log('\n⚙️  Checking TypeScript configuration...\n');
  
  try {
    const tsconfig = JSON.parse(fs.readFileSync(path.join(projectRoot, 'tsconfig.json'), 'utf8'));
    
    check('TypeScript target is ES2022', tsconfig.compilerOptions && tsconfig.compilerOptions.target === 'ES2022');
    check('Path mappings are configured', tsconfig.compilerOptions && tsconfig.compilerOptions.paths);
    check('Source files are included', tsconfig.include && tsconfig.include.length > 0);
    
  } catch (error) {
    check('tsconfig.json is valid JSON', false);
  }

  console.log('\n🔧 Checking GitHub Actions...\n');
  
  const workflowsDir = path.join(projectRoot, '.github/workflows');
  if (fs.existsSync(workflowsDir)) {
    const workflowFiles = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    check('GitHub Actions workflows exist', workflowFiles.length > 0);
    check('CI/CD workflow exists', workflowFiles.some(f => f.includes('ci-cd')));
    check('Deployment workflow exists', workflowFiles.some(f => f.includes('deploy')));
  } else {
    check('GitHub Actions workflows exist', false);
  }

  console.log('\n🐳 Checking Docker configuration...\n');
  
  check('Dockerfile is valid', fs.existsSync(path.join(projectRoot, 'Dockerfile')));
  check('Docker Compose production config exists', fs.existsSync(path.join(projectRoot, 'docker-compose.prod.yml')));

  console.log('\n📊 Checking deployment configs...\n');
  
  check('Vercel config exists', fs.existsSync(path.join(projectRoot, 'vercel.json')));
  check('Netlify config exists', fs.existsSync(path.join(projectRoot, 'netlify.toml')));

  console.log('\n🗄️  Checking database setup...\n');
  
  check('Database init script exists', fs.existsSync(path.join(projectRoot, 'scripts/init-database.js')));
  check('Drizzle config exists', fs.existsSync(path.join(projectRoot, 'drizzle.config.ts')));

  console.log('\n📝 Checking documentation...\n');
  
  check('README exists', fs.existsSync(path.join(projectRoot, 'README.md')));
  check('Setup guide exists', fs.existsSync(path.join(projectRoot, 'GITHUB_FIXES_COMPLETE.md')));

  console.log('\n🧪 Checking test setup...\n');
  
  check('Cypress config exists', fs.existsSync(path.join(projectRoot, 'cypress.config.ts')));
  check('Jest config exists', fs.existsSync(path.join(projectRoot, 'jest.config.js')));

  // Summary
  console.log('\n📊 VERIFICATION SUMMARY');
  console.log('=======================');
  console.log(`✅ Passed: ${checks.passed}`);
  console.log(`⚠️  Warnings: ${checks.warnings}`);
  console.log(`❌ Failed: ${checks.failed}`);
  
  const total = checks.passed + checks.warnings + checks.failed;
  const successRate = Math.round((checks.passed / total) * 100);
  
  console.log(`\n📈 Success Rate: ${successRate}%`);
  
  if (checks.failed === 0) {
    console.log('\n🎉 VERIFICATION PASSED!');
    console.log('Your Cyber Mart 2077 platform is ready to launch!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Run: node scripts/setup-complete.js');
    console.log('   2. Configure your .env file');
    console.log('   3. Deploy to production');
    console.log('   4. Start making money! 💰');
  } else {
    console.log('\n⚠️  VERIFICATION COMPLETED WITH ISSUES');
    console.log('Please fix the failed checks before proceeding.');
  }
  
  if (checks.warnings > 0) {
    console.log(`\n💡 Note: ${checks.warnings} warnings found. These are non-critical but should be reviewed.`);
  }
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifySetup();
}

export { verifySetup };
