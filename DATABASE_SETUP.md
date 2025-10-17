# Database Setup Guide - Supabase

This guide explains how to set up the required tables in Supabase for AgriGo 2.0.

## Prerequisites

- Supabase account
- Access to your Supabase project dashboard

## Setup Steps

### 1. Create Users Table

Go to the Supabase SQL Editor and run:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'resource_provider')),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

---

### 2. Create Resources Table

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  availability VARCHAR(50) DEFAULT 'available' CHECK (availability IN ('available', 'unavailable')),
  price DECIMAL(10, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_resources_provider ON resources(provider_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_location ON resources(location);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can read resources
CREATE POLICY "Resources are publicly readable" ON resources
  FOR SELECT USING (true);

-- Create policy: Resource providers can create resources
CREATE POLICY "Resource providers can create resources" ON resources
  FOR INSERT WITH CHECK (
    auth.uid() = provider_id AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'resource_provider'
  );

-- Create policy: Resource providers can update their own resources
CREATE POLICY "Resource providers can update own resources" ON resources
  FOR UPDATE USING (auth.uid() = provider_id);

-- Create policy: Resource providers can delete their own resources
CREATE POLICY "Resource providers can delete own resources" ON resources
  FOR DELETE USING (auth.uid() = provider_id);
```

---

### 3. Create Bookings Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX idx_bookings_resource ON bookings(resource_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy: Farmers can read their own bookings
CREATE POLICY "Farmers can read own bookings" ON bookings
  FOR SELECT USING (auth.uid() = farmer_id);

-- Create policy: Resource providers can read bookings for their resources
CREATE POLICY "Providers can read bookings for own resources" ON bookings
  FOR SELECT USING (
    resource_id IN (
      SELECT id FROM resources WHERE provider_id = auth.uid()
    )
  );

-- Create policy: Farmers can create bookings
CREATE POLICY "Farmers can create bookings" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid() = farmer_id AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'farmer'
  );

-- Create policy: Farmers can update their own bookings
CREATE POLICY "Farmers can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = farmer_id);

-- Create policy: Providers can update bookings for their resources
CREATE POLICY "Providers can update bookings for own resources" ON bookings
  FOR UPDATE USING (
    resource_id IN (
      SELECT id FROM resources WHERE provider_id = auth.uid()
    )
  );
```

---

### 4. Create Chats Table (Optional - if using Supabase instead of Firebase)

If you prefer to store chat messages in Supabase instead of Firebase:

```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_chats_booking ON chats(booking_id);
CREATE INDEX idx_chats_sender ON chats(sender_id);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Create policy: Users in a booking can read messages
CREATE POLICY "Users can read booking messages" ON chats
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE farmer_id = auth.uid() OR 
            resource_id IN (SELECT id FROM resources WHERE provider_id = auth.uid())
    )
  );

-- Create policy: Users can send messages in bookings they're part of
CREATE POLICY "Users can send messages in their bookings" ON chats
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    booking_id IN (
      SELECT id FROM bookings 
      WHERE farmer_id = auth.uid() OR 
            resource_id IN (SELECT id FROM resources WHERE provider_id = auth.uid())
    )
  );
```

---

## Verification

After creating the tables, verify they exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- `users`
- `resources`
- `bookings`
- `chats` (if you created it)

---

## Seed Data (Optional)

To add test data:

```sql
-- Add test users
INSERT INTO users (email, name, role) VALUES
  ('farmer1@example.com', 'John Farmer', 'farmer'),
  ('provider1@example.com', 'Jane Provider', 'resource_provider');

-- Add test resources
INSERT INTO resources (name, type, description, price, location, provider_id) VALUES
  ('Tractor Model XYZ', 'machinery', 'Heavy-duty tractor', 50.00, 'New York', 
   (SELECT id FROM users WHERE email = 'provider1@example.com')),
  ('Harvester Machine', 'machinery', 'Automated harvester', 75.00, 'California',
   (SELECT id FROM users WHERE email = 'provider1@example.com'));

-- Add test booking
INSERT INTO bookings (farmer_id, resource_id, start_date, end_date, quantity, total_price, status) VALUES
  ((SELECT id FROM users WHERE email = 'farmer1@example.com'),
   (SELECT id FROM resources LIMIT 1),
   '2025-11-01', '2025-11-05', 1, 250.00, 'pending');
```

---

## Backup and Recovery

### Backup Database

1. Go to your Supabase project dashboard
2. Navigate to **Settings → Backups**
3. Click **Create Manual Backup**

### Restore from Backup

1. Go to **Settings → Backups**
2. Select the backup you want to restore
3. Click **Restore**

---

## Performance Optimization

For better performance, consider:

1. **Add Indexes** (already included in setup)
2. **Enable Caching** in Supabase
3. **Use Connection Pooling** for database connections
4. **Monitor Query Performance** via Supabase dashboard

---

## Security Best Practices

1. **Enable RLS** (Row Level Security) - Already enabled
2. **Use HTTPS** for all connections
3. **Limit Permissions** - Use minimum required privileges
4. **Rotate Credentials** - Regularly update API keys
5. **Monitor Access** - Check audit logs regularly

---

## Troubleshooting

### Issue: "Permission denied" errors

**Solution:** Check RLS policies are correctly configured and match user roles.

### Issue: Queries running slowly

**Solution:** 
1. Check indexes are created
2. Analyze slow queries in the Supabase dashboard
3. Add indexes on frequently filtered columns

### Issue: Connection timeout

**Solution:**
1. Check database is running
2. Verify firewall rules allow your IP
3. Check Supabase service status

---

## Next Steps

1. ✅ Create all required tables
2. ✅ Set up Row Level Security (RLS)
3. ✅ Add indexes for performance
4. ✅ Test connections from your application
5. Start using the database in your backend

For more information, visit [Supabase Documentation](https://supabase.com/docs)
