// 🚀 CYBER MART 2077 - AUTOMATION TESTING SCRIPT
// This script tests all automation features and API endpoints

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n========================================', 'cyan');
  log(message, 'cyan');
  log('========================================', 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test functions
async function testHealthCheck() {
  try {
    const response = await axios.get(`${API_BASE}/../health`);
    logSuccess('Health check passed');
    logInfo(`Status: ${response.data.status}`);
    logInfo(`Message: ${response.data.message}`);
    return true;
  } catch (error) {
    logError('Health check failed');
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testProductsAPI() {
  try {
    const response = await axios.get(`${API_BASE}/products`);
    logSuccess('Products API working');
    logInfo(`Found ${response.data.products?.length || 0} products`);
    return true;
  } catch (error) {
    logError('Products API failed');
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testAutomationStatus() {
  try {
    const response = await axios.get(`${API_BASE}/automation/status`);
    logSuccess('Automation status API working');
    logInfo(`Automation active: ${response.data.data?.automationActive}`);
    logInfo(`Total revenue: $${response.data.data?.revenueMetrics?.totalRevenue || 0}`);
    logInfo(`Total products: ${response.data.data?.revenueMetrics?.totalProducts || 0}`);
    return true;
  } catch (error) {
    logError('Automation status API failed');
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testAutomationStart() {
  try {
    const response = await axios.post(`${API_BASE}/automation/start`);
    logSuccess('Automation start API working');
    logInfo(`Status: ${response.data.status}`);
    logInfo(`Features activated: ${response.data.features?.length || 0}`);
    return true;
  } catch (error) {
    logError('Automation start API failed');
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testAutomationProjections() {
  try {
    const response = await axios.get(`${API_BASE}/automation/projections`);
    logSuccess('Automation projections API working');
    const projections = response.data.projections;
    if (projections) {
      logInfo(`Current revenue: $${projections.current}`);
      logInfo(`Monthly projection: $${projections.monthly}`);
      logInfo(`Yearly projection: $${projections.yearly}`);
    }
    return true;
  } catch (error) {
    logError('Automation projections API failed');
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testMegaProfitAnalytics() {
  try {
    const response = await axios.get(`${API_BASE}/automation/mega-profit-analytics`);
    logSuccess('Mega Profit Engine API working');
    logInfo(`Status: ${response.data.analytics?.status}`);
    return true;
  } catch (error) {
    logError('Mega Profit Engine API failed');
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testViralAnalytics() {
  try {
    const response = await axios.get(`${API_BASE}/automation/viral-analytics`);
    logSuccess('Viral Growth Engine API working');
    logInfo(`Status: ${response.data.status}`);
    return true;
  } catch (error) {
    logError('Viral Growth Engine API failed');
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testAIServices() {
  try {
    const response = await axios.get(`${API_BASE}/ai/status`);
    logSuccess('AI Services API working');
    return true;
  } catch (error) {
    logWarning('AI Services API not available (this is optional)');
    return true; // Not critical
  }
}

async function runAllTests() {
  logHeader('🚀 CYBER MART 2077 - AUTOMATION TESTING');
  log('Testing all API endpoints and automation features...\n', 'yellow');

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Products API', fn: testProductsAPI },
    { name: 'Automation Status', fn: testAutomationStatus },
    { name: 'Automation Start', fn: testAutomationStart },
    { name: 'Automation Projections', fn: testAutomationProjections },
    { name: 'Mega Profit Analytics', fn: testMegaProfitAnalytics },
    { name: 'Viral Analytics', fn: testViralAnalytics },
    { name: 'AI Services', fn: testAIServices }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    log(`\n🧪 Testing: ${test.name}`, 'magenta');
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Final results
  logHeader('📊 TEST RESULTS');
  logSuccess(`Passed: ${passed}`);
  if (failed > 0) {
    logError(`Failed: ${failed}`);
  }
  
  const totalTests = tests.length;
  const successRate = Math.round((passed / totalTests) * 100);
  
  if (successRate >= 80) {
    logSuccess(`Overall Success Rate: ${successRate}% 🎉`);
    log('\n🚀 Your CYBER MART 2077 platform is ready for launch!', 'green');
  } else if (successRate >= 60) {
    logWarning(`Overall Success Rate: ${successRate}% - Some issues detected`);
    log('\n🔧 Check the failed tests and ensure all services are running', 'yellow');
  } else {
    logError(`Overall Success Rate: ${successRate}% - Multiple issues detected`);
    log('\n🛠️ Please check your server setup and try again', 'red');
  }

  log('\n💡 Quick fixes:', 'cyan');
  log('   • Make sure the server is running: npm run dev:server', 'blue');
  log('   • Check database connection in .env file', 'blue');
  log('   • Verify PostgreSQL is running', 'blue');
  log('   • Check for any error messages in server console\n', 'blue');
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the tests
if (require.main === module) {
  runAllTests().catch(error => {
    logError('Test suite failed to run:', error.message);
    process.exit(1);
  });
}

module.exports = { runAllTests };
