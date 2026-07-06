// ============ STATE ============
// Central project state — single source of truth

const State = {
  project: null,
  spec: null,
  generatedCode: null,
  currentGameUrl: null,
  generationCount: 0,
  credits: Infinity,
  files: [],         // file tree data
  agentLogs: [],     // execution log entries
  viewport: 'desktop',

  reset() {
    this.project = null;
    this.spec = null;
    this.generatedCode = null;
    this.currentGameUrl = null;
    this.generationCount = 0;
    this.files = [];
    this.agentLogs = [];
    this.viewport = 'desktop';
  }
};
