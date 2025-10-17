require('dotenv').config();
const supabase = require('../config/supabase');

const verify = async () => {
  console.log('\n📋 AgriGo 2.0 Backend Verification\n');
  console.log('═'.repeat(50));

  // Check Environment Variables
  console.log('\n1️⃣  Checking Environment Variables...');
  const envVars = {
    'SUPABASE_URL': process.env.SUPABASE_URL,
    'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
    'PORT': process.env.PORT || 5000,
    'NODE_ENV': process.env.NODE_ENV || 'development'
  };

  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });

  // Check Supabase Connection
  console.log('\n2️⃣  Testing Supabase Connection...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('COUNT(*)', { count: 'exact' })
      .limit(1);

    if (error) {
      console.log(`   ✗ Connection failed: ${error.message}`);
    } else {
      console.log('   ✓ Supabase connection successful');
    }
  } catch (error) {
    console.log(`   ✗ Connection error: ${error.message}`);
  }

  // Check Required Tables
  console.log('\n3️⃣  Checking Database Tables...');
  const requiredTables = ['users', 'resources', 'bookings'];

  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.log(`   ✗ ${table}: ${error.message}`);
      } else {
        console.log(`   ✓ ${table}: Table exists`);
      }
    } catch (error) {
      console.log(`   ✗ ${table}: ${error.message}`);
    }
  }

  // Check Backend Server
  console.log('\n4️⃣  Checking Backend Server...');
  try {
    const response = await fetch('http://localhost:5000/health');
    if (response.ok) {
      const data = await response.json();
      console.log('   ✓ Backend server is running');
      console.log(`   ✓ Server time: ${data.timestamp}`);
    } else {
      console.log(`   ✗ Server returned status: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ✗ Cannot reach backend: ${error.message}`);
  }

  // Check API Endpoints
  console.log('\n5️⃣  Checking API Endpoints...');
  const endpoints = [
    { method: 'GET', path: '/api/docs', description: 'API Documentation' },
    { method: 'GET', path: '/health', description: 'Health Check' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:5000${endpoint.path}`, {
        method: endpoint.method
      });
      const status = response.ok ? '✓' : '✗';
      console.log(`   ${status} ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
    } catch (error) {
      console.log(`   ✗ ${endpoint.method} ${endpoint.path} - Error: ${error.message}`);
    }
  }

  console.log('\n═'.repeat(50));
  console.log('\n✅ Verification Complete!\n');
  console.log('📚 Next Steps:');
  console.log('   1. Set up database tables: npm run seed');
  console.log('   2. Test API endpoints using Postman (see POSTMAN_COLLECTION.md)');
  console.log('   3. Integrate with React frontend');
  console.log('   4. Read FRONTEND_INTEGRATION.md for integration guide\n');
};

verify();
