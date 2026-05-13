-- Supabase Schema for DVYA Basketball League

-- 1. Divisions Table
CREATE TABLE divisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Teams Table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    division_id UUID REFERENCES divisions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    coach_name TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Players Table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    jersey_no INTEGER,
    position VARCHAR(10),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Games Table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    division_id UUID REFERENCES divisions(id) ON DELETE CASCADE,
    home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    game_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT different_teams CHECK (home_team_id <> away_team_id)
);

-- Insert initial divisions
INSERT INTO divisions (name) VALUES 
('14U'), 
('18U'), 
('Junior'), 
('Senior');

-- Enable Row Level Security (RLS)
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read Access)
CREATE POLICY "Public read divisions" ON divisions FOR SELECT USING (true);
CREATE POLICY "Public read teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
CREATE POLICY "Public read games" ON games FOR SELECT USING (true);

-- Enable full management for anon (Demo mode)
CREATE POLICY "Enable all for anon teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon games" ON games FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon divisions" ON divisions FOR ALL USING (true) WITH CHECK (true);

-- 5. Team Standings View
CREATE OR REPLACE VIEW team_standings AS
WITH team_games AS (
    -- Home Games
    SELECT 
        home_team_id as team_id, 
        division_id,
        home_score as pts_for, 
        away_score as pts_against,
        CASE WHEN home_score > away_score THEN 1 ELSE 0 END as is_win,
        CASE WHEN home_score < away_score THEN 1 ELSE 0 END as is_loss,
        CASE WHEN home_score = away_score THEN 1 ELSE 0 END as is_draw
    FROM games
    WHERE game_date <= NOW()
    UNION ALL
    -- Away Games
    SELECT 
        away_team_id as team_id, 
        division_id,
        away_score as pts_for, 
        home_score as pts_against,
        CASE WHEN away_score > home_score THEN 1 ELSE 0 END as is_win,
        CASE WHEN away_score < home_score THEN 1 ELSE 0 END as is_loss,
        CASE WHEN away_score = home_score THEN 1 ELSE 0 END as is_draw
    FROM games
    WHERE game_date <= NOW()
)
SELECT 
    t.id as team_id,
    t.name as team_name,
    t.division_id,
    COUNT(tg.team_id) as gp,
    COALESCE(SUM(is_win), 0) as w,
    COALESCE(SUM(is_loss), 0) as l,
    COALESCE(SUM(is_draw), 0) as d,
    COALESCE(SUM(pts_for), 0) as pf,
    COALESCE(SUM(pts_against), 0) as pa,
    COALESCE(SUM(pts_for), 0) - COALESCE(SUM(pts_against), 0) as diff,
    CASE 
        WHEN COUNT(tg.team_id) = 0 THEN 0 
        ELSE ROUND(CAST(SUM(is_win) AS NUMERIC) / COUNT(tg.team_id), 3) 
    END as win_pct
FROM teams t
LEFT JOIN team_games tg ON t.id = tg.team_id
GROUP BY t.id, t.name, t.division_id
ORDER BY win_pct DESC, diff DESC, pf DESC;

-- 6. Player Game Stats Table
CREATE TABLE player_game_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    rebounds INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    steals INTEGER DEFAULT 0,
    blocks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(game_id, player_id)
);

-- Enable RLS for stats
ALTER TABLE player_game_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stats" ON player_game_stats FOR SELECT USING (true);
CREATE POLICY "Enable all for anon stats" ON player_game_stats FOR ALL USING (true) WITH CHECK (true);
