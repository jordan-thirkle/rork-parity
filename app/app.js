// ============ APP ============
// RorkParity Phase 2 — Orchestrator with Supabase integration
// Coordinates FORGEMASTER → SMITH → WHETSTONE pipeline
// through the Hermes agent session.

const App = {
  deferredFeatures: [],
  planMode: false,
  supabaseReady: false,

  async init() {
    // Init UI modules
    AgentLog.init();
    Explorer.init();
    Chat.init();
    Preview.init();
    Bridge.init();

    // Resizable divider
    this.initDivider();

    // Wired buttons
    document.getElementById('loginBtn').addEventListener('click', () => this.showAuthModal('signin'));
    document.getElementById('exportBtn').addEventListener('click', () => this.exportGame());
    document.getElementById('newProjectBtn').addEventListener('click', () => this.newProject());
    document.getElementById('syncBtn').addEventListener('click', () => this.syncGitHub());

    // Deferred modal
    document.getElementById('deferredContinue').addEventListener('click', () => {
      document.getElementById('deferredModal').classList.add('hidden');
    });

    // Project selector
    const projectSelect = document.getElementById('projectSelect');
    if (projectSelect) {
      projectSelect.addEventListener('change', (e) => {
        if (e.target.value) this.loadProject(e.target.value);
      });
    }

    // Auth modal events
    document.getElementById('authToggleBtn').addEventListener('click', () => this.toggleAuthMode());
    document.getElementById('authPrimaryBtn').addEventListener('click', () => this.submitAuth());
    document.getElementById('authGoogleBtn').addEventListener('click', () => this.authWithGoogle());
    // Close on backdrop
    document.querySelector('#authModal .modal-backdrop').addEventListener('click', () => {
      document.getElementById('authModal').classList.add('hidden');
    });

    // Supabase config
    document.getElementById('configSaveBtn').addEventListener('click', () => this.saveSupabaseConfig());
    document.getElementById('configSkipBtn').addEventListener('click', () => {
      document.getElementById('supabaseConfigModal').classList.add('hidden');
    });

    // Init Supabase
    this.supabaseReady = await SupabaseClient.init();

    if (!this.supabaseReady && !localStorage.getItem('rorkparity:supabase-skipped')) {
      // Show config modal
      document.getElementById('supabaseConfigModal').classList.remove('hidden');
    } else if (this.supabaseReady) {
      this.updateAuthUI();
      if (SupabaseClient.user) await this.loadProjectList();
    }

    // Set initial viewport
    Preview.setViewport('desktop');

    AgentLog.add('Workspace initialized. Ready for game generation.', 'info');
    Preview.showEmpty();
    Bridge.status('Bridge inactive (waiting for game load)');
  },

  initDivider() {
    const divider = document.getElementById('divider');
    const leftPanel = document.getElementById('leftPanel');
    let isDragging = false;

    divider.addEventListener('mousedown', (e) => {
      isDragging = true;
      divider.classList.add('active');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const pct = (e.clientX / window.innerWidth) * 100;
      if (pct >= 25 && pct <= 60) {
        leftPanel.style.width = pct + '%';
        leftPanel.style.minWidth = 'unset';
        leftPanel.style.maxWidth = 'unset';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        divider.classList.remove('active');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  },

  // ===== SUPABASE AUTH =====

  showAuthModal(mode) {
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('authError').classList.add('hidden');
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
    if (mode === 'signup') {
      document.getElementById('authModalTitle').textContent = 'Create Account';
      document.getElementById('authPrimaryBtn').textContent = 'Sign Up';
      document.getElementById('authToggleBtn').textContent = 'Already have an account? Sign In';
      document.getElementById('authModal').dataset.mode = 'signup';
    } else {
      document.getElementById('authModalTitle').textContent = 'Sign In';
      document.getElementById('authPrimaryBtn').textContent = 'Sign In';
      document.getElementById('authToggleBtn').textContent = 'Create account';
      document.getElementById('authModal').dataset.mode = 'signin';
    }
  },

  toggleAuthMode() {
    const current = document.getElementById('authModal').dataset.mode;
    this.showAuthModal(current === 'signin' ? 'signup' : 'signin');
  },

  async submitAuth() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const mode = document.getElementById('authModal').dataset.mode;
    const errorEl = document.getElementById('authError');

    if (!email || !password) {
      errorEl.textContent = 'Email and password are required.';
      errorEl.classList.remove('hidden');
      return;
    }
    if (password.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters.';
      errorEl.classList.remove('hidden');
      return;
    }

    try {
      if (mode === 'signup') {
        await SupabaseClient.signUp(email, password);
        errorEl.textContent = 'Account created! Check your email for confirmation.';
        errorEl.classList.remove('hidden');
        errorEl.style.color = 'var(--success)';
      } else {
        await SupabaseClient.signIn(email, password);
        document.getElementById('authModal').classList.add('hidden');
        this.updateAuthUI();
        await this.loadProjectList();
      }
    } catch (err) {
      errorEl.textContent = err.message || 'Authentication failed.';
      errorEl.classList.remove('hidden');
      errorEl.style.color = '';
    }
  },

  async authWithGoogle() {
    try {
      await SupabaseClient.signInWithOAuth('google');
    } catch (err) {
      const errorEl = document.getElementById('authError');
      errorEl.textContent = err.message || 'Google sign-in failed.';
      errorEl.classList.remove('hidden');
    }
  },

  async signOut() {
    await SupabaseClient.signOut();
    this.updateAuthUI();
    document.getElementById('projectSelect').classList.add('hidden');
    document.getElementById('projectTitleInline').classList.remove('hidden');
    document.getElementById('projectTitleInline').textContent = 'No project';
  },

  onAuthStateChange(user, profile) {
    this.updateAuthUI(user, profile);
    if (user) this.loadProjectList();
  },

  updateAuthUI(user, profile) {
    user = user || SupabaseClient.user;
    profile = profile || SupabaseClient.profile;

    const loginBtn = document.getElementById('loginBtn');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const newBtn = document.getElementById('newProjectBtn');
    const exportBtn = document.getElementById('exportBtn');
    const syncBtn = document.getElementById('syncBtn');
    const creditIndicator = document.getElementById('creditIndicator');

    if (user) {
      loginBtn.classList.add('hidden');
      userMenuBtn.classList.remove('hidden');
      userMenuBtn.innerHTML = `<span id="userMenuName">${profile?.display_name || user.email || 'Account'}</span>`;
      userMenuBtn.onclick = () => this.signOut();
      userMenuBtn.title = 'Sign out';
      newBtn.classList.remove('hidden');
      exportBtn.classList.remove('hidden');
      syncBtn.classList.remove('hidden');
      creditIndicator.textContent = `${profile?.credit_balance ?? '?'} credits`;
    } else {
      loginBtn.classList.remove('hidden');
      userMenuBtn.classList.add('hidden');
      newBtn.classList.add('hidden');
      exportBtn.classList.add('hidden');
      syncBtn.classList.add('hidden');
      creditIndicator.textContent = '— credits';
    }
  },

  saveSupabaseConfig() {
    const url = document.getElementById('configSupabaseUrl').value.trim();
    const anonKey = document.getElementById('configAnonKey').value.trim();
    if (url && anonKey) {
      SupabaseClient.saveConfig(url, anonKey);
      document.getElementById('supabaseConfigModal').classList.add('hidden');
      // Re-init
      this.supabaseReady = true;
      SupabaseClient.init().then(() => {
        this.updateAuthUI();
        if (SupabaseClient.user) this.loadProjectList();
      });
      AgentLog.add('Supabase configured. Auth and cloud storage enabled.', 'ok');
    }
  },

  // ===== PROJECTS =====

  async loadProjectList() {
    if (!SupabaseClient.user) return;
    try {
      const projects = await SupabaseClient.listProjects();
      const select = document.getElementById('projectSelect');
      select.innerHTML = '<option value="">— Select project —</option>';
      projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.title;
        select.appendChild(opt);
      });
      select.classList.remove('hidden');
      document.getElementById('projectTitleInline').classList.add('hidden');
      document.getElementById('projectSelector').classList.remove('hidden');
    } catch (err) {
      AgentLog.warn('Failed to load projects: ' + err.message);
    }
  },

  async loadProject(id) {
    AgentLog.add(`Loading project: ${id}`, 'info');
    // Project metadata will be loaded by the agent pipeline
    AgentLog.add('Project selected. Agent will resume from last context.', 'info');
  },

  async newProject() {
    State.reset();
    AgentLog.clear();
    Explorer.setFiles([]);
    Preview.showEmpty();
    document.getElementById('projectTitleDisplay').textContent = 'No project';
    document.getElementById('projectBadge').textContent = 'No project';
    document.getElementById('phaseBadge').textContent = 'Phase 2';
    document.getElementById('projectSelect').value = '';
    this.deferredFeatures = [];

    if (SupabaseClient.user) {
      // Create project in Supabase
      try {
        const proj = await SupabaseClient.createProject('Untitled Game');
        AgentLog.add(`Project created: ${proj.title} (${proj.id})`, 'ok');
        await this.loadProjectList();
        document.getElementById('projectSelect').value = proj.id;
      } catch (err) {
        AgentLog.warn('Could not create cloud project: ' + err.message);
      }
    }
    AgentLog.add('New project started.', 'info');
  },

  // ===== PIPELINE METHODS =====

  forgemaster(spec) {
    State.spec = spec;
    const specName = spec.name || spec.title || 'Unnamed game';
    const deferred = spec.deferred || [];

    AgentLog.forgemaster(specName);
    AgentLog.add(`Spec: ${spec.engine || 'Canvas2D'} — ${spec.description || 'No description'}`, 'info');
    AgentLog.add(`Systems: ${(spec.systems || []).join(', ')}`, 'info');
    this.deferredFeatures = deferred;
    this.deferredFeatures.forEach(f => AgentLog.deferred(f));

    State.project = specName;
    document.getElementById('projectTitleDisplay').textContent = specName;
    document.getElementById('projectBadge').textContent = specName;

    const phase = spec.phase || 1;
    document.getElementById('phaseBadge').textContent = `Phase ${phase}`;
  },

  smith(code, fileName = 'game.js') {
    AgentLog.smith(fileName);
    State.generatedCode = code;

    // Auto-version: commit current state before overwriting
    AgentLog.add('Auto-version: snapshotting current state before generation...', 'info');
    // In Hermes: run `bash scripts/auto-version.sh` before calling smith()
    // The web app logs intent; the actual git commit happens in the agent shell

    const files = [
      { name: 'index.html', size: `${(code.length / 1000).toFixed(1)} KB` },
      { name: fileName, size: `${(code.length / 1000).toFixed(1)} KB` }
    ];
    if (State.spec && State.spec.engine === 'Phaser 3') {
      files.unshift({ name: 'phaser.min.js', size: 'CDN', action: null });
    }
    Explorer.setFiles(files);

    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    Preview.loadGame(url);

    setTimeout(() => {
      Bridge.injectInterceptors();
    }, 500);

    // Save version to Supabase if available
    if (SupabaseClient.client && SupabaseClient.user) {
      const projectSelect = document.getElementById('projectSelect');
      const projectId = projectSelect?.value;
      if (projectId) {
        SupabaseClient.saveGameVersion(
          projectId,
          State.spec,
          code,
          url,
          null
        ).then(version => {
          AgentLog.add(`Version ${version.version_number} saved to cloud.`, 'ok');
        }).catch(err => {
          AgentLog.warn('Version save failed: ' + err.message);
        });
      }
    }
  },

  whetstone(checks) {
    const allPassed = checks.every(c => c.result === true || c.result === 'pass');
    AgentLog.whetstone(allPassed ? true : false);
    checks.forEach(c => {
      const icon = (c.result === true || c.result === 'pass') ? '✓' : '✗';
      const status = (c.result === true || c.result === 'pass') ? 'Pass' : 'Fail';
      AgentLog.add(`  ${icon} ${c.name}: ${status}`, c.result === true || c.result === 'pass' ? 'ok' : 'err');
    });
    Preview.status(allPassed ? 'Validation passed' : 'Validation failed');
    return allPassed;
  },

  lorekeeper(packageInfo) {
    AgentLog.lorekeeper(packageInfo);
    Preview.status('Project packaged');
  },

  crier(publishInfo) {
    AgentLog.crier(publishInfo);
    Preview.status('Ready for publish');
  },

  // ===== LOCAL GENERATION =====

  pickTemplate(text) {
    const t = text.toLowerCase();
    if (/(3d|three\.js|world|fps|first person)/.test(t)) return { template: '3d', engine: 'Three.js', file: '3d-world.html' };
    if (/(brawler|combat|zone|zones|arena|fighter)/.test(t)) return { template: 'brawler', engine: 'Phaser 3', file: 'zone-brawler.html' };
    if (/(shooter|space|ship|asteroid|bullet)/.test(t)) return { template: 'shooter', engine: 'Canvas2D', file: 'shooter.html' };
    if (/(idle|rpg|loot|xp|auto|rpg)/.test(t)) return { template: 'idle', engine: 'Canvas2D', file: 'idle-rpg.html' };
    return { template: 'brawler', engine: 'Phaser 3', file: 'zone-brawler.html' };
  },

  runLocalPipeline(text) {
    const pick = this.pickTemplate(text);
    const code = LocalGenerator.generate(pick.template, text);
    if (!code) return null;
    return { code, fileName: pick.file, engine: pick.engine };
  },

  runChecks(code) {
    const checks = [
      { name: 'HTML structure', result: code.includes('<!DOCTYPE html') && code.includes('</html>') },
      { name: 'Script present', result: code.includes('<script') },
      { name: 'No empty output', result: code.length > 200 },
      { name: 'No deferred breakage', result: !code.includes('TODO') }
    ];
    const allPassed = checks.every(c => c.result === true || c.result === 'pass');
    checks.forEach(c => {
      const ok = c.result === true || c.result === 'pass';
      AgentLog.add(`  ${ok ? '✓' : '✗'} ${c.name}: ${ok ? 'Pass' : 'Fail'}`, ok ? 'ok' : 'err');
    });
    Preview.status(allPassed ? 'Validation passed' : 'Validation failed');
    return allPassed;
  },

  loadGeneratedCode(code, fileName) {
    State.generatedCode = code;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    Preview.loadGame(url);
    Explorer.setFiles([
      { name: fileName, size: `${(code.length / 1000).toFixed(1)} KB` },
      { name: 'style.css', size: 'local' },
      { name: 'app.js', size: 'local' }
    ]);
    document.getElementById('projectTitleDisplay').textContent = fileName;
  },

  // ===== USER ACTIONS =====

  onUserMessage(text) {
    State.generationCount++;
    AgentLog.add(`Received: "${text.slice(0, 100)}${text.length > 100 ? '...' : ''}"`, 'info');

    const result = this.runLocalPipeline(text);
    if (result) {
      this.loadGeneratedCode(result.code, result.fileName);
      AgentLog.add(`[SMITH] Generated: ${result.fileName}`, 'ok');
      AgentLog.whetstone(this.runChecks(result.code));
      this.lorekeeper({ filename: result.fileName, engine: result.engine });
      this.crier({ status: 'Ready for publish', filename: result.fileName });
    } else {
      AgentLog.add('No local generator matched this request. Try a prompt from the quick-start strip.', 'warn');
    }
  },

  onFileUploaded(name, dataUrl) {
    Explorer.addFile({ name: name, icon: '📎', action: null });
  },

  exportGame() {
    if (!State.generatedCode) {
      AgentLog.warn('No game to export. Generate a game first.');
      return;
    }
    const blob = new Blob([State.generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(State.project || 'game').toLowerCase().replace(/\s+/g, '-')}-v${State.generationCount}.html`;
    a.click();
    URL.revokeObjectURL(url);
    AgentLog.add('Game exported as HTML file.', 'ok');
  },

  syncGitHub() {
    AgentLog.add('GitHub sync requested — feature planned for Phase 2.', 'warn');
    this.deferredFeatures.push('GitHub sync (Phase 2)');
  },

  showDeferred() {
    const modal = document.getElementById('deferredModal');
    const list = document.getElementById('deferredList');
    modal.classList.remove('hidden');
    if (this.deferredFeatures.length === 0) {
      list.textContent = 'No features were deferred in this generation.';
    } else {
      list.innerHTML = this.deferredFeatures.map(f => `• ${f}`).join('<br>');
    }
  }
};

// Boot on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
