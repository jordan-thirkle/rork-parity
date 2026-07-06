// Simple API server for RorkParity
// Serves game list from Supabase

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://xuwfpcogphhrkagwgzpf.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_YSFRl77bFARtSluR4IDIUA_6xtc8cI-'
);

// Mock game data for now (will be replaced with Supabase query)
const mockGames = [
  {
    title: 'Medieval Castle Defense',
    description: 'Defend your castle from waves of enemies',
    filename: 'auto-20260706-medieval-castle-defense.html',
    emoji: '🏰',
    created_at: new Date().toISOString(),
    version: '1.0'
  },
  {
    title: 'Zone Brawler',
    description: 'Fight through 5 zones with increasing difficulty',
    filename: 'zone-brawler-v1.html',
    emoji: '⚔️',
    created_at: new Date().toISOString(),
    version: '1.0'
  }
];

async function getGames() {
  try {
    const { data, error } = await supabase
      .from('game_versions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    return data || mockGames;
  } catch (error) {
    console.error('Failed to fetch games from Supabase:', error);
    return mockGames;
  }
}

module.exports = { getGames };
