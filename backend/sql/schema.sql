-- AgriGo 2.0 Database Schema
-- Run this script in Supabase SQL Editor

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'resource_provider')),
  phone VARCHAR(20),
  address TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can read public profile info (for viewing provider details)
CREATE POLICY "Users can read public profiles" ON users
  FOR SELECT USING (true);

---

-- 2. Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  availability VARCHAR(50) DEFAULT 'available' CHECK (availability IN ('available', 'unavailable')),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  location VARCHAR(255) NOT NULL,
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  specifications JSONB,
  rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_resources_provider ON resources(provider_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_location ON resources(location);
CREATE INDEX idx_resources_availability ON resources(availability);
CREATE INDEX idx_resources_price ON resources(price);

-- Enable RLS on resources table
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read resources
CREATE POLICY "Resources are publicly readable" ON resources
  FOR SELECT USING (true);

-- Policy: Resource providers can create resources
CREATE POLICY "Resource providers can create resources" ON resources
  FOR INSERT WITH CHECK (
    auth.uid() = provider_id AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'resource_provider'
  );

-- Policy: Resource providers can update their own resources
CREATE POLICY "Resource providers can update own resources" ON resources
  FOR UPDATE USING (auth.uid() = provider_id);

-- Policy: Resource providers can delete their own resources
CREATE POLICY "Resource providers can delete own resources" ON resources
  FOR DELETE USING (auth.uid() = provider_id);

---

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(12, 2) NOT NULL CHECK (total_price >= 0),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  delivery_location VARCHAR(255),
  special_requirements TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX idx_bookings_resource ON bookings(resource_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);
CREATE INDEX idx_bookings_created ON bookings(created_at);

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Farmers can read their own bookings
CREATE POLICY "Farmers can read own bookings" ON bookings
  FOR SELECT USING (auth.uid() = farmer_id);

-- Policy: Resource providers can read bookings for their resources
CREATE POLICY "Providers can read bookings for own resources" ON bookings
  FOR SELECT USING (
    resource_id IN (
      SELECT id FROM resources WHERE provider_id = auth.uid()
    )
  );

-- Policy: Farmers can create bookings
CREATE POLICY "Farmers can create bookings" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid() = farmer_id AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'farmer'
  );

-- Policy: Farmers can update their own bookings
CREATE POLICY "Farmers can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = farmer_id);

-- Policy: Providers can update bookings for their resources
CREATE POLICY "Providers can update bookings for own resources" ON bookings
  FOR UPDATE USING (
    resource_id IN (
      SELECT id FROM resources WHERE provider_id = auth.uid()
    )
  );

---

-- 4. Supabase Chats Table (Alternative to Firebase)
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_name VARCHAR(255),
  sender_role VARCHAR(50),
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  attachment_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_chats_booking ON chats(booking_id);
CREATE INDEX idx_chats_sender ON chats(sender_id);
CREATE INDEX idx_chats_created ON chats(created_at);
CREATE INDEX idx_chats_unread ON chats(booking_id, read) WHERE read = false;

-- Enable RLS on chats table
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Policy: Users in a booking can read messages
CREATE POLICY "Users can read booking messages" ON chats
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE farmer_id = auth.uid() OR 
            resource_id IN (SELECT id FROM resources WHERE provider_id = auth.uid())
    )
  );

-- Policy: Users can send messages in bookings they're part of
CREATE POLICY "Users can send messages in their bookings" ON chats
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    booking_id IN (
      SELECT id FROM bookings 
      WHERE farmer_id = auth.uid() OR 
            resource_id IN (SELECT id FROM resources WHERE provider_id = auth.uid())
    )
  );

-- Policy: Users can update their own messages
CREATE POLICY "Users can update own messages" ON chats
  FOR UPDATE USING (auth.uid() = sender_id);

---

-- 5. Reviews Table (Optional)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_reviews_resource ON reviews(resource_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);

-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Reviews are publicly readable
CREATE POLICY "Reviews are publicly readable" ON reviews
  FOR SELECT USING (true);

-- Policy: Users can create reviews for bookings they participated in
CREATE POLICY "Users can create reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    booking_id IN (
      SELECT id FROM bookings WHERE farmer_id = auth.uid()
    )
  );

---

-- 6. Notifications Table (Optional)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_id UUID,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = false;

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

---

-- 7. Create Updated Trigger for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to resources table
DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to bookings table
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to reviews table
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

---

-- 8. Verify all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
