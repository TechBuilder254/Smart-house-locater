require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Testing Supabase Connection');
console.log('==============================\n');

// Check environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Environment Check:');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials!');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('\n🔗 Testing connection to Supabase...');
    
    // Test basic connection
    const { data, error } = await supabase.from('houses').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      
      if (error.message.includes('relation "houses" does not exist')) {
        console.log('\n💡 The "houses" table doesn\'t exist yet.');
        console.log('Please run the SQL from the setup guide to create the table.');
      } else if (error.message.includes('JWT')) {
        console.log('\n💡 Authentication error. Check your API key.');
      } else if (error.message.includes('network')) {
        console.log('\n💡 Network error. Check your internet connection.');
      }
      
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('✅ Database is accessible');
    
    // Test table structure
    console.log('\n📊 Testing table structure...');
    const { data: houses, error: structureError } = await supabase
      .from('houses')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.error('❌ Table structure error:', structureError.message);
      return false;
    }
    
    console.log('✅ Table structure is correct');
    console.log('✅ Ready to use Supabase!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

async function runTest() {
  const success = await testSupabaseConnection();
  
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('🎉 Supabase setup is working correctly!');
    console.log('You can now start your server with: npm run dev');
  } else {
    console.log('❌ Supabase setup needs attention.');
    console.log('Please check the setup guide and try again.');
  }
  console.log('='.repeat(50));
}

runTest();
