require('dotenv').config();
const supabase = require('../config/supabase');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Sample users data
    const sampleUsers = [
      {
        email: 'farmer1@example.com',
        password: 'FarmerPass123',
        name: 'John Smith',
        role: 'farmer'
      },
      {
        email: 'farmer2@example.com',
        password: 'FarmerPass123',
        name: 'Sarah Johnson',
        role: 'farmer'
      },
      {
        email: 'provider1@example.com',
        password: 'ProviderPass123',
        name: 'Mike Equipment',
        role: 'resource_provider'
      },
      {
        email: 'provider2@example.com',
        password: 'ProviderPass123',
        name: 'Jane Resources',
        role: 'resource_provider'
      }
    ];

    console.log('👤 Creating sample users...');
    const createdUsers = [];

    for (const user of sampleUsers) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUpWithPassword({
          email: user.email,
          password: user.password
        });

        if (authError) {
          console.log(`⚠️  User ${user.email} might already exist: ${authError.message}`);
          continue;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          ])
          .select();

        if (profileError) {
          console.log(`❌ Error creating profile for ${user.email}: ${profileError.message}`);
          continue;
        }

        createdUsers.push({ ...profileData[0], password: user.password });
        console.log(`✅ Created user: ${user.name} (${user.role})`);
      } catch (error) {
        console.log(`❌ Error creating user ${user.email}: ${error.message}`);
      }
    }

    // Get provider IDs
    const providers = createdUsers.filter(u => u.role === 'resource_provider');

    if (providers.length > 0) {
      console.log('\n🛠️  Creating sample resources...');

      const sampleResources = [
        {
          name: 'Tractor Model XYZ',
          type: 'machinery',
          description: 'Heavy-duty tractor suitable for plowing and tilling',
          availability: 'available',
          price: 50.00,
          location: 'New York, USA',
          provider_id: providers[0].id
        },
        {
          name: 'Harvester Machine',
          type: 'machinery',
          description: 'Automated harvester for grain crops',
          availability: 'available',
          price: 75.00,
          location: 'Iowa, USA',
          provider_id: providers[0].id
        },
        {
          name: 'Irrigation System',
          type: 'equipment',
          description: 'Complete drip irrigation setup',
          availability: 'available',
          price: 35.00,
          location: 'California, USA',
          provider_id: providers[1].id
        },
        {
          name: 'Soil Testing Kit',
          type: 'tools',
          description: 'Professional soil analysis kit',
          availability: 'available',
          price: 15.00,
          location: 'Texas, USA',
          provider_id: providers[1].id
        },
        {
          name: 'Pesticide Sprayer',
          type: 'equipment',
          description: 'Commercial-grade pesticide sprayer',
          availability: 'available',
          price: 25.00,
          location: 'Illinois, USA',
          provider_id: providers[0].id
        }
      ];

      for (const resource of sampleResources) {
        const { data, error } = await supabase
          .from('resources')
          .insert([resource])
          .select();

        if (error) {
          console.log(`❌ Error creating resource ${resource.name}: ${error.message}`);
          continue;
        }

        console.log(`✅ Created resource: ${resource.name}`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Sample credentials:');
    console.log('Farmer: farmer1@example.com / FarmerPass123');
    console.log('Provider: provider1@example.com / ProviderPass123');

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
