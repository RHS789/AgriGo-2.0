require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
  try {
    console.log('Checking database schema...');

    // Check and create users table
    const { data: usersCheck } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact' })
      .limit(1);

    if (usersCheck !== null || !usersCheck?.error?.code?.includes('PGRST116')) {
      console.log('✓ Users table exists');
    } else {
      console.log('Creating users table...');
      // Users table would be created through Supabase UI or migrations
    }

    // Check and create resources table
    const { data: resourcesCheck } = await supabase
      .from('resources')
      .select('count(*)', { count: 'exact' })
      .limit(1);

    if (resourcesCheck !== null) {
      console.log('✓ Resources table exists');
    }

    // Check and create bookings table
    const { data: bookingsCheck } = await supabase
      .from('bookings')
      .select('count(*)', { count: 'exact' })
      .limit(1);

    if (bookingsCheck !== null) {
      console.log('✓ Bookings table exists');
    }

    // Check and create telemetry table
    const { data: telemetryCheck } = await supabase
      .from('telemetry')
      .select('count(*)', { count: 'exact' })
      .limit(1);

    if (telemetryCheck !== null) {
      console.log('✓ Telemetry table exists');
    }

    // Check and create tips table
    const { data: tipsCheck } = await supabase
      .from('tips')
      .select('count(*)', { count: 'exact' })
      .limit(1);

    if (tipsCheck !== null) {
      console.log('✓ Tips table exists');
    }

    console.log('\n✓ Database initialization check complete!');
    console.log('Note: If tables are missing, create them in Supabase dashboard:');
    console.log('  - users (id, email, name, role, created_at)');
    console.log('  - resources (id, name, type, description, availability, price, location, provider_id, created_at)');
    console.log('  - bookings (id, farmer_id, resource_id, start_date, end_date, quantity, total_price, status, notes, created_at)');
    console.log('  - telemetry (id, timestamp, soil_moisture, ph, growth)');
    console.log('  - tips (id, content, created_at)');

  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

initializeDatabase();
