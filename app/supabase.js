// ============ SUPABASE ============
// ForgeLoop Supabase client — auth + DB + storage + credits
// Auto-configured for project: xuwfpcogphhrkagwgzpf

const SUPABASE_CONFIG = {
  url: 'https://xuwfpcogphhrkagwgzpf.supabase.co',
  anonKey: 'sb_publishable_YSFRl77bFARtSluR4IDIUA_6xtc8cI-'
};

const SupabaseClient = {
  client: null,
  user: null,
  profile: null,
  ready: false,

  async init() {
    // Check for saved config first
    const savedUrl = localStorage.getItem('supabase:url');
    const savedKey = localStorage.getItem('supabase:anonKey');
    const url = savedUrl || SUPABASE_CONFIG.url;
    const anonKey = savedKey || SUPABASE_CONFIG.anonKey;

    if (!url || !anonKey) {
      console.warn('Supabase: No config found');
      return false;
    }

    try {
      this.client = supabase.createClient(url, anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      });

      // Get current session
      const { data: { session }, error: sessionError } = await this.client.auth.getSession();
      if (sessionError) throw sessionError;

      if (session?.user) {
        this.user = session.user;
        await this.loadProfile();
      }

      // Listen for auth state changes
      this.client.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          this.user = session?.user || null;
          if (this.user) await this.loadProfile();
        } else if (event === 'SIGNED_OUT') {
          this.user = null;
          this.profile = null;
        }
        // Notify app
        if (window.App?.onAuthStateChange) {
          window.App.onAuthStateChange(this.user, this.profile);
        }
      });

      this.ready = true;
      console.log('Supabase: Initialized', this.user?.email || '(no session)');
      return true;
    } catch (err) {
      console.error('Supabase init failed:', err);
      return false;
    }
  },

  saveConfig(url, anonKey) {
    localStorage.setItem('supabase:url', url);
    localStorage.setItem('supabase:anonKey', anonKey);
  },

  async loadProfile() {
    if (!this.user) return;
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single();
      if (error && error.code !== 'PGRST116') {
        // Profile might not exist yet — create it
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await this.client
            .rpc('handle_new_user');
          if (!createError) this.profile = newProfile;
        }
        return;
      }
      this.profile = data;
    } catch (err) {
      console.warn('Failed to load profile:', err);
    }
  },

  // ===== AUTH =====

  async signUp(email, password) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: { data: { display_name: email.split('@')[0] } }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email, password
    });
    if (error) throw error;
    return data;
  },

  async signInWithOAuth(provider) {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
    this.user = null;
    this.profile = null;
    localStorage.removeItem('supabase:url');
    localStorage.removeItem('supabase:anonKey');
  },

  // ===== PROJECTS =====

  async listProjects() {
    const { data, error } = await this.client
      .from('game_projects')
      .select('*')
      .eq('user_id', this.user.id)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createProject(title, engine = 'Canvas2D') {
    const { data, error } = await this.client
      .from('game_projects')
      .insert({
        user_id: this.user.id,
        title,
        engine,
        generation_count: 0,
        status: 'draft'
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(id, updates) {
    const { data, error } = await this.client
      .from('game_projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(id) {
    const { error } = await this.client
      .from('game_projects')
      .delete()
      .eq('id', id)
      .eq('user_id', this.user.id);
    if (error) throw error;
  },

  // ===== VERSIONS =====

  async saveGameVersion(projectId, spec, code, url, notes) {
    const { data, error } = await this.client
      .from('game_versions')
      .insert({
        project_id: projectId,
        version_number: 0, // Will be set by trigger
        spec: spec,
        code_preview: code.substring(0, 500),
        preview_url: url,
        size_bytes: code.length,
        engine: spec?.engine || 'Canvas2D',
        commit_notes: notes
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ===== ASSETS =====

  async uploadAsset(projectId, file, path = '') {
    const filePath = `${projectId}/${Date.now()}_${file.name}`;
    const { data, error } = await this.client.storage
      .from('assets')
      .upload(filePath, file);
    if (error) throw error;
    // Save reference
    const { data: assetRef, error: refError } = await this.client
      .from('assets')
      .insert({
        project_id: projectId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: filePath
      })
      .select()
      .single();
    if (refError) throw refError;
    return assetRef;
  },

  // ===== CREDITS =====

  async getCredits() {
    if (!this.profile) return 0;
    return this.profile.credit_balance || 0;
  },

  async consumeCredits(amount = 1) {
    try {
      const { data, error } = await this.client.rpc('consume_credits', {
        p_amount: amount
      });
      if (error) throw error;
      this.profile.credit_balance = (this.profile.credit_balance || 0) - amount;
      return data;
    } catch (err) {
      console.warn('Credit consumption failed:', err);
      return false;
    }
  },

  // ===== LEADERBOARDS =====

  async submitScore(leaderboardId, score, metadata = {}) {
    const { data, error } = await this.client
      .from('leaderboard_entries')
      .insert({
        leaderboard_id: leaderboardId,
        user_id: this.user.id,
        score,
        metadata
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getLeaderboard(leaderboardId, limit = 50) {
    const { data, error } = await this.client
      .from('leaderboard_entries')
      .select('*, profiles:user_id(display_name)')
      .eq('leaderboard_id', leaderboardId)
      .order('score', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  }
};
