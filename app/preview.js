// ============ PREVIEW ============
// Live game preview with viewport switching + sandbox management

const Preview = {
  frame: null,
  empty: null,
  overlay: null,
  fpsEl: null,
  statusEl: null,

  init() {
    this.frame = document.getElementById('previewFrame');
    this.empty = document.getElementById('previewEmpty');
    this.overlay = document.getElementById('previewOverlay');
    this.fpsEl = document.getElementById('previewFps');
    this.statusEl = document.getElementById('previewStatus');

    // Viewport buttons
    document.querySelectorAll('.viewport-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setViewport(btn.dataset.viewport);
      });
    });

    // Viewport actions
    document.getElementById('refreshPreviewBtn').addEventListener('click', () => this.refresh());
    document.getElementById('openPreviewBtn').addEventListener('click', () => this.openInTab());
    document.getElementById('qrCodeBtn').addEventListener('click', () => this.showQR());
  },

  setViewport(mode) {
    State.viewport = mode;
    const container = document.getElementById('previewContainer');

    // Remove all device classes
    container.classList.remove('device-mobile', 'device-tablet', 'device-vr');

    this.frame.className = 'preview-frame';
    if (mode === 'desktop') {
      this.frame.style.maxWidth = '';
      this.frame.style.maxHeight = '';
      this.frame.style.borderRadius = '';
      this.frame.style.border = '';
    } else {
      this.frame.classList.add(`viewport-${mode}`);
      container.classList.add(`device-${mode}`);
      // Set device time for status bar overlay
      if (mode === 'mobile') {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        container.dataset.deviceTime = time;
        // Rotate button indicator
        document.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('rotate-phone'));
        const mobileBtn = document.querySelector('.viewport-btn[data-viewport="mobile"]');
        if (mobileBtn) mobileBtn.classList.add('rotate-phone');
      }
    }
    this.status(`Viewport: ${mode}`);
  },

  showEmpty() {
    this.frame.classList.add('hidden');
    this.overlay.classList.add('hidden');
    this.empty.classList.remove('hidden');
    const title = document.getElementById('projectTitleDisplay');
    if (title) title.textContent = 'No project';
    const badge = document.getElementById('phaseBadge');
    if (badge) badge.textContent = 'Phase 2';
  },

  loadGame(url) {
    if (!url) {
      this.showEmpty();
      return;
    }
    State.currentGameUrl = url;
    this.empty.classList.add('hidden');
    this.frame.classList.remove('hidden');
    this.overlay.classList.remove('hidden');
    this.frame.src = url;
    this.status('Game loaded');
    const title = document.getElementById('projectTitleDisplay');
    if (title) title.textContent = State.project || 'Generated game';
  },

  refresh() {
    if (this.frame.src) {
      this.frame.src = this.frame.src;
      this.status('Refreshed');
    }
  },

  openInTab() {
    if (State.currentGameUrl) {
      window.open(State.currentGameUrl, '_blank');
    }
  },

  showQR() {
    const modal = document.getElementById('qrModal');
    modal.classList.remove('hidden');
    const urlDisplay = document.getElementById('qrUrlDisplay');
    urlDisplay.textContent = State.currentGameUrl || window.location.href;
    document.getElementById('qrCloseBtn').onclick = () => modal.classList.add('hidden');
    modal.querySelector('.modal-backdrop').onclick = () => modal.classList.add('hidden');
  },

  status(msg) {
    if (this.statusEl) this.statusEl.textContent = msg;
  },
};
