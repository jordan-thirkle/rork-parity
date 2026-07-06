// ============ CHAT ============
// Conversational input + agent log

const Chat = {
  inputEl: null,
  sendBtn: null,
  planModeBtn: null,

  init() {
    this.inputEl = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.planModeBtn = document.getElementById('planModeBtn');

    // Send button
    this.sendBtn.addEventListener('click', () => this.send());

    // Enter to send, Shift+Enter for newline
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });

    // Upload button
    document.getElementById('uploadBtn').addEventListener('click', () => {
      document.getElementById('fileUploadInput').click();
    });
    document.getElementById('fileUploadInput').addEventListener('change', (e) => {
      this.handleFileUpload(e.target.files[0]);
    });

    // Plan mode toggle
    this.planModeBtn.addEventListener('click', () => this.togglePlanMode());

    // Quick-start buttons
    document.querySelectorAll('.quick-start-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.inputEl.value = btn.dataset.prompt;
        this.send();
      });
    });
  },

  send() {
    const text = this.inputEl.value.trim();
    if (!text) return;

    // Add user message display to log
    AgentLog.add(`🧑 ${text}`, 'info');

    // Dispatch to app
    App.onUserMessage(text);

    // Clear input
    this.inputEl.value = '';
    this.inputEl.style.height = 'auto';
  },

  handleFileUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      AgentLog.add(`📎 Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info');
      App.onFileUploaded(file.name, e.target.result);
    };
    reader.readAsDataURL(file);
  },

  togglePlanMode() {
    const isPlan = this.planModeBtn.classList.toggle('active');
    this.planModeBtn.textContent = isPlan ? 'Build' : 'Plan';
    if (isPlan) {
      this.sendBtn.textContent = 'Plan';
      AgentLog.add('Plan Mode active — discussing architecture before generation.', 'info');
    } else {
      this.sendBtn.textContent = 'Generate';
      AgentLog.add('Build Mode active — generating code now.', 'info');
    }
  }
};
