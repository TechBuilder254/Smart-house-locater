require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔧 Testing Direct Connection Methods');
console.log('===================================\n');

// Try different connection approaches
const testMethods = [
  {
    name: 'Direct Connection with IP',
    uri: 'mongodb+srv://mwangikamande707_db_user:UqdQ37mEMMBUspFr@cluster0.z9przdx.mongodb.net/smart_house_locator',
    options: {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 1,
      retryWrites: true,
      w: 'majority',
      directConnection: false
    }
  },
  {
    name: 'Connection with DNS Cache Disabled',
    uri: 'mongodb+srv://mwangikamande707_db_user:UqdQ37mEMMBUspFr@cluster0.z9przdx.mongodb.net/smart_house_locator',
    options: {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 1,
      retryWrites: true,
      w: 'majority',
      directConnection: false,
      dnsServer: '8.8.8.8'
    }
  }
];

async function testDirectConnection(method, index) {
  console.log(`\n${index + 1}. Testing: ${method.name}`);
  console.log('─'.repeat(50));
  
  try {
    console.log('Attempting to connect...');
    console.log('Connection options:', JSON.stringify(method.options, null, 2));
    
    const conn = await mongoose.connect(method.uri, method.options);
    
    console.log('✅ SUCCESS!');
    console.log(`   Connected to: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    await mongoose.disconnect();
    console.log('   Connection closed successfully');
    
    return { success: true, method: method.name };
    
  } catch (error) {
    console.log('❌ FAILED');
    console.log(`   Error: ${error.message}`);
    
    if (error.message.includes('ETIMEOUT')) {
      console.log('   Issue: DNS timeout - network connectivity problem');
    } else if (error.message.includes('whitelist')) {
      console.log('   Issue: IP not whitelisted');
    } else if (error.message.includes('authentication')) {
      console.log('   Issue: Authentication failed');
    } else {
      console.log('   Issue: Unknown connection problem');
    }
    
    return { success: false, method: method.name, error: error.message };
  }
}

async function runDirectTests() {
  console.log('Starting direct connection tests...\n');
  
  const results = [];
  
  for (let i = 0; i < testMethods.length; i++) {
    const result = await testDirectConnection(testMethods[i], i);
    results.push(result);
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 DIRECT CONNECTION TEST RESULTS');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎉 WORKING CONNECTION METHODS:');
    successful.forEach(result => {
      console.log(`   • ${result.method}`);
    });
  } else {
    console.log('\n❌ All direct connection methods failed.');
    console.log('\n🔧 NEXT STEPS:');
    console.log('1. Try using a mobile hotspot (different network)');
    console.log('2. Check if your ISP is blocking MongoDB Atlas');
    console.log('3. Try using a VPN');
    console.log('4. Consider using a local MongoDB installation');
  }
}

runDirectTests().catch(console.error);
