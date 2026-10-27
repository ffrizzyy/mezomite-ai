-- Mezomite.ai schema, first migration.
-- Run with: npm run db:remote (or db:local for a local SQLite file).
-- The function layer writes only; there is no read path for the public.

CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  company_size TEXT,
  message TEXT NOT NULL,
  source_page TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'id',
  turnstile_passed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  CHECK (company_size IS NULL OR company_size IN ('1-10', '11-30', '31-100', '101-300', '300+')),
  CHECK (status IN ('received', 'emailed', 'failed')),
  CHECK (locale IN ('id', 'en'))
);

CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions (email);
CREATE INDEX IF NOT EXISTS idx_submissions_source ON submissions (source_page);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions (created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  slot_start TEXT NOT NULL,
  slot_end TEXT NOT NULL,
  timezone TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  package TEXT,
  notes TEXT,
  source_page TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  CHECK (status IN ('booked', 'cancelled', 'completed'))
);

-- A cancelled slot can be booked again, so the uniqueness is partial.
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_slot_booked
  ON bookings (slot_start) WHERE status = 'booked';
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings (email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

CREATE TABLE IF NOT EXISTS consent_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  necessary INTEGER NOT NULL DEFAULT 1,
  analytics INTEGER NOT NULL DEFAULT 0,
  marketing INTEGER NOT NULL DEFAULT 0,
  policy_version TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  CHECK (necessary = 1),
  CHECK (analytics IN (0, 1)),
  CHECK (marketing IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_consent_visitor ON consent_records (visitor_id);
CREATE INDEX IF NOT EXISTS idx_consent_created ON consent_records (created_at);

-- Sequential reference numbers, allocated atomically with an upsert.
CREATE TABLE IF NOT EXISTS counters (
  name TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);

INSERT INTO counters (name, value) VALUES ('submission', 0), ('booking', 0)
  ON CONFLICT (name) DO NOTHING;

-- Fixed-window rate limiting. One row per bucket, reset in place.
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_window ON rate_limits (window_start);
