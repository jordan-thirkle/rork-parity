-- Migration 0002: Seed starting credits for new users.
-- New users are locked out because the credits column defaulted to 0.
-- Set the column default to 5 so all newly-created rows start with 5 credits.
-- Apply via drizzle-kit or psql — this file is authored only and not executed here.

ALTER TABLE users ALTER COLUMN credits SET DEFAULT 5;
