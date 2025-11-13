-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'client')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Galleries table
CREATE TABLE public.galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL CHECK (service_type IN ('video', 'photo')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  cover_photo_id UUID,
  is_public BOOLEAN DEFAULT true,
  password_hash TEXT,
  allow_downloads BOOLEAN DEFAULT true,
  allow_favorites BOOLEAN DEFAULT true,
  allow_orders BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos/Videos table
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES public.galleries(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  preview_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  aspect_ratio DECIMAL(10, 4),
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  metadata JSONB,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery invites (for private galleries)
CREATE TABLE public.gallery_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES public.galleries(id) ON DELETE CASCADE NOT NULL,
  client_email TEXT NOT NULL,
  access_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  has_accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES public.galleries(id) ON DELETE CASCADE NOT NULL,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE NOT NULL,
  client_identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gallery_id, media_id, client_identifier)
);

-- Downloads tracking
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES public.galleries(id) ON DELETE CASCADE NOT NULL,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE,
  client_identifier TEXT NOT NULL,
  download_type TEXT NOT NULL CHECK (download_type IN ('web', 'full_res', 'zip_all')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES public.galleries(id) ON DELETE CASCADE NOT NULL,
  client_identifier TEXT NOT NULL,
  client_email TEXT,
  client_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'fulfilled', 'cancelled')),
  total_amount INTEGER NOT NULL, -- in cents
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE NOT NULL,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL, -- in cents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_galleries_user_id ON public.galleries(user_id);
CREATE INDEX idx_galleries_slug ON public.galleries(slug);
CREATE INDEX idx_galleries_status ON public.galleries(status);
CREATE INDEX idx_media_gallery_id ON public.media(gallery_id);
CREATE INDEX idx_media_sort_order ON public.media(gallery_id, sort_order);
CREATE INDEX idx_favorites_gallery_id ON public.favorites(gallery_id);
CREATE INDEX idx_favorites_client ON public.favorites(client_identifier);
CREATE INDEX idx_orders_gallery_id ON public.orders(gallery_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Set cover_photo_id foreign key after media table exists
ALTER TABLE public.galleries 
  ADD CONSTRAINT fk_cover_photo 
  FOREIGN KEY (cover_photo_id) 
  REFERENCES public.media(id) 
  ON DELETE SET NULL;

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Galleries policies
CREATE POLICY "Owners can view own galleries" ON public.galleries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Owners can create galleries" ON public.galleries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update own galleries" ON public.galleries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete own galleries" ON public.galleries
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public galleries are viewable by all" ON public.galleries
  FOR SELECT USING (status = 'published' AND is_public = true);

-- Media policies
CREATE POLICY "Owners can manage media in own galleries" ON public.media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.galleries 
      WHERE galleries.id = media.gallery_id 
      AND galleries.user_id = auth.uid()
    )
  );

CREATE POLICY "Media in public galleries is viewable" ON public.media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.galleries 
      WHERE galleries.id = media.gallery_id 
      AND galleries.status = 'published' 
      AND galleries.is_public = true
    )
  );

-- Favorites policies
CREATE POLICY "Anyone can manage their own favorites" ON public.favorites
  FOR ALL USING (true);

-- Downloads policies
CREATE POLICY "Anyone can create download records" ON public.downloads
  FOR INSERT WITH CHECK (true);

-- Orders policies
CREATE POLICY "Owners can view orders for their galleries" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.galleries 
      WHERE galleries.id = orders.gallery_id 
      AND galleries.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their own orders" ON public.orders
  FOR UPDATE USING (true);

-- Order items policies
CREATE POLICY "Anyone can view order items" ON public.order_items
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON public.galleries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
