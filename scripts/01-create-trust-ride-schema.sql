-- Trust Ride Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  guardian_contact TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year INTEGER NOT NULL,
  vehicle_plate TEXT NOT NULL UNIQUE,
  rating DECIMAL(2,1) DEFAULT 5.0,
  is_verified BOOLEAN DEFAULT false,
  blockchain_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rides table
CREATE TABLE IF NOT EXISTS public.rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id),
  pickup_location TEXT NOT NULL,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  destination_location TEXT NOT NULL,
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  fare DECIMAL(10, 2),
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  blockchain_verified BOOLEAN DEFAULT false,
  blockchain_tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create safety_alerts table
CREATE TABLE IF NOT EXISTS public.safety_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES public.rides(id),
  alert_type TEXT NOT NULL DEFAULT 'panic' CHECK (alert_type IN ('panic', 'emergency', 'suspicious')),
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  message TEXT,
  guardian_notified BOOLEAN DEFAULT false,
  blockchain_verified BOOLEAN DEFAULT false,
  blockchain_tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blockchain_logs table
CREATE TABLE IF NOT EXISTS public.blockchain_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_type TEXT NOT NULL CHECK (record_type IN ('driver_verification', 'ride', 'alert')),
  record_id UUID NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  block_number BIGINT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  gas_used BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Rides policies
CREATE POLICY "Users can view their own rides" ON public.rides
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rides" ON public.rides
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rides" ON public.rides
  FOR UPDATE USING (auth.uid() = user_id);

-- Safety alerts policies
CREATE POLICY "Users can view their own alerts" ON public.safety_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts" ON public.safety_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Blockchain logs policies (read-only for users)
CREATE POLICY "Users can view blockchain logs for their records" ON public.blockchain_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rides WHERE id = record_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.safety_alerts WHERE id = record_id AND user_id = auth.uid()
    )
  );

-- Drivers table policies (public read access for booking)
CREATE POLICY "Anyone can view verified drivers" ON public.drivers
  FOR SELECT USING (is_verified = true);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, guardian_contact)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'guardian_contact', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON public.rides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
