DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first TEXT NOT NULL CHECK (first != ''),
  last TEXT NOT NULL CHECK (last != ''),
  email TEXT NOT NULL UNIQUE CHECK (email != ''),
  password TEXT NOT NULL CHECK (password != ''),
  url TEXT,
  bio TEXT, 
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS reset_codes CASCADE;

CREATE TABLE reset_codes(
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL CHECK (code != ''),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

