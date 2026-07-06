// ============ AGENT LOG ============
// Execution log panel — shows the AI agent's thought process

const AgentLog = {
  el: null,
  bodyEl: null,
  entries: [],

  init() {
    this.el = document.getElementById('agentLogPane');
    this.bodyEl = document.getElementById('agentLogBody');
    document.getElementById('clearLogBtn').addEventListener('click', () => this.clear());
  },

  add(msg, type = 'info') {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const entry = { time, msg, type };
    this.entries.push(entry);
    if (this.entries.length > 500) this.entries.shift();
    this.render(entry);
    this.scrollToBottom();
    return entry;
  },

  render(entry) {
    const div = document.createElement('div');
    div.className = `log-entry log-${entry.type}`;
    div.innerHTML = `<span class="log-time">${entry.time}</span><span class="log-msg">${entry.msg}</span>`;
    this.bodyEl.appendChild(div);
  },

  clear() {
    this.bodyEl.innerHTML = '';
    this.entries = [];
  },

  scrollToBottom() {
    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
  },

  // Pipeline stages
  forgemaster(specName) {
    this.add(`[FORGEMASTER] Generating spec: ${specName}`, 'info');
  },
  smith(fileName) {
    this.add(`[SMITH] Generating code: ${fileName}`, 'info');
  },
  whetstone(result) {
    if (result === true || result === 'pass') {
      this.add(`[WHETSTONE] Validation passed ✓`, 'ok');
    } else if (result === false || result === 'fail') {
      this.add(`[WHETSTONE] Validation failed ✗`, 'err');
    } else {
      this.add(`[WHETSTONE] ${result}`, 'info');
    }
  },
  lorekeeper(msg) {
    this.add(`[LOREKEEPER] ${msg}`, 'info');
  },
  crier(msg) {
    this.add(`[CRIER] ${msg}`, 'ok');
  },
  deferred(features) {
    if (Array.isArray(features)) {
      features.forEach(f => this.add(`Deferred: ${f}`, 'warn'));
    } else {
      this.add(`Deferred: ${features}`, 'warn');
    }
  },
  error(msg) {
    this.add(msg, 'err');
  }
};
