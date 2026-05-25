-- InvestQuest Database Schema
-- Apply this in the Supabase SQL editor (Dashboard → SQL Editor → New Query)

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT CHECK (role IN ('teen', 'parent')) NOT NULL,
  display_name TEXT NOT NULL,
  avatar_id TEXT DEFAULT 'default',
  invite_code CHAR(6) UNIQUE,   -- 6-digit code teens share with parents
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PARENT-TEEN LINK
-- ============================================================
CREATE TABLE parent_child (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  teen_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, teen_id)
);

-- ============================================================
-- MODULE PROGRESS PER TEEN
-- ============================================================
CREATE TABLE progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teen_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  day_number INT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  quiz_score INT NOT NULL,
  xp_earned INT NOT NULL,
  scenario_choice TEXT,
  UNIQUE(teen_id, module_id, day_number)
);

-- ============================================================
-- XP AND LEVELS
-- ============================================================
CREATE TABLE teen_stats (
  teen_id UUID REFERENCES profiles(id) PRIMARY KEY,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BADGES
-- ============================================================
CREATE TABLE badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teen_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(teen_id, badge_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write their own row
CREATE POLICY "own_profile_all" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Allow reading any profile by invite_code (needed for parent linking)
CREATE POLICY "read_by_invite_code" ON profiles
  FOR SELECT USING (true);

-- Progress: teens own their data
CREATE POLICY "teen_own_progress" ON progress
  FOR ALL USING (auth.uid() = teen_id);

-- Stats: teens own their data
CREATE POLICY "teen_own_stats" ON teen_stats
  FOR ALL USING (auth.uid() = teen_id);

-- Badges: teens own their data
CREATE POLICY "teen_own_badges" ON badges
  FOR ALL USING (auth.uid() = teen_id);

-- Parent-child: parents and linked teens can read
CREATE POLICY "parent_child_read" ON parent_child
  FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = teen_id);

-- Parents can insert their own link
CREATE POLICY "parent_child_insert" ON parent_child
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- Parents can read their linked teen's progress
CREATE POLICY "parent_read_progress" ON progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_child
      WHERE parent_id = auth.uid() AND teen_id = progress.teen_id
    )
  );

-- Parents can read their linked teen's stats
CREATE POLICY "parent_read_stats" ON teen_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_child
      WHERE parent_id = auth.uid() AND teen_id = teen_stats.teen_id
    )
  );

-- Parents can read their linked teen's badges
CREATE POLICY "parent_read_badges" ON badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_child
      WHERE parent_id = auth.uid() AND teen_id = badges.teen_id
    )
  );

-- ============================================================
-- AI HINT RATE LIMITING (10 hints per teen per day)
-- ============================================================
CREATE TABLE hint_usage (
  teen_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INT DEFAULT 1,
  PRIMARY KEY (teen_id, usage_date)
);

ALTER TABLE hint_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teen_own_hints" ON hint_usage
  FOR ALL USING (auth.uid() = teen_id);
