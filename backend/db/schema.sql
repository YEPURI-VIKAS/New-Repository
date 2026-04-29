-- PostgreSQL schema for College Discovery Platform
-- Use this later to swap the mock JSON store with a real DB.

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS colleges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  fees BIGINT NOT NULL, -- INR per year
  rating DOUBLE PRECISION NOT NULL,
  placement DOUBLE PRECISION NOT NULL, -- percentage
  courses JSONB NOT NULL, -- array of strings
  image TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_colleges (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, college_id)
);

CREATE INDEX IF NOT EXISTS saved_colleges_user_id_idx ON saved_colleges(user_id);
CREATE INDEX IF NOT EXISTS colleges_location_idx ON colleges(location);

