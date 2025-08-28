require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 MongoDB Connection Diagnostic Test');
console.log('=====================================\n');

// Test different connection strings
const connectionStrings = [
  {
    name: 'Original Connection String',
    uri: 'mongodb+srv://mwangikamande707_db_user:UqdQ37mEMMBUspFr@cluster0.z9przdx.mongodb.net/smart_house_locator?retryWrites=true&w=majority&appName=Cluster0'
  },
  {
    name: 'Simplified Connection String',
    uri: 'mongodb+srv://mwangikamande707_db_user:UqdQ37mEMMBUspFr@cluster0.z9przdx.mongodb.net/smart_house_locator'
  },
  {
    name: 'Without Database Name',
    uri: 'mongodb+srv://mwangikamande707_db_user:UqdQ37mEMMBUspFr@cluster0.z9przdx.mongodb.net/'
  },
  {
    name: 'With Different Options',
    uri: 'mongodb+srv://mwangikamande707_db_user:UqdQ37mEMMBUspFr@cluster0.z9przdx.mongodb.net/smart_house_locator?retryWrites=true&w=majority'
  }
];

async function testConnection(connectionString, index) {
  console.log(`\n${index + 1}. Testing: ${connectionString.name}`);
  console.log('─'.repeat(50));
  
  try {
    // Create a new mongoose instance for each test
    const testMongoose = require('mongoose');
    
    console.log('Attempting to connect...');
    
    const conn = await testMongoose.connect(connectionString.uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 1,
    });
    
    console.log('✅ SUCCESS!');
    console.log(`   Connected to: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState}`);
    
    await testMongoose.disconnect();
    console.log('   Connection closed successfully');
    
    return { success: true, method: connectionString.name };
    
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
    
    return { success: false, method: connectionString.name, error: error.message };
  }
}

async function runAllTests() {
  console.log('Starting comprehensive connection tests...\n');
  
  const results = [];
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const result = await testConnection(connectionStrings[i], i);
    results.push(result);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
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
  }
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED CONNECTION METHODS:');
    failed.forEach(result => {
      console.log(`   • ${result.method}: ${result.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (successful.length > 0) {
    console.log('🎉 At least one connection method worked!');
    console.log('You can now proceed with the application setup.');
  } else {
    console.log('❌ All connection methods failed.');
    console.log('\n🔧 RECOMMENDED ACTIONS:');
    console.log('1. Check your internet connection');
    console.log('2. Verify MongoDB Atlas cluster is running');
    console.log('3. Check Network Access settings (should allow 0.0.0.0/0)');
    console.log('4. Verify Database Access permissions');
    console.log('5. Try using a different network (mobile hotspot)');
  }
}

runAllTests().catch(console.error);
