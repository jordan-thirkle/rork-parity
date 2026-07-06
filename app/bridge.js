// ============ BRIDGE ============
// PostMessage bridge between sandboxed iframe and parent workspace
// Mirrors Rork's sandbox architecture: iframe <-> postMessage <-> parent

const Bridge = {
  ALLOWED_ORIGINS: null, // set at runtime

  init() {
    window.addEventListener('message', (event) => {
      // Security: verify origin
      if (this.ALLOWED_ORIGINS && !this.ALLOWED_ORIGINS.includes(event.origin)) return;
      this.handleMessage(event);
    });
  },

  handleMessage(event) {
    const { type, payload } = event.data || {};
    if (!type) return;

    switch (type) {
      case 'RUNTIME_EXCEPTION_DETECTED':
        this.handleError(payload);
        break;
      case 'GAME_READY':
        AgentLog.add('Game runtime initialized.', 'ok');
        Bridge.postToFrame({ type: 'WORKSPACE_INIT', payload: { fpsLimit: 60 } });
        break;
      case 'ASSET_CLICKED':
        this.handleAssetClick(payload);
        break;
      case 'FPS_UPDATE':
        Preview.setFps(payload.fps);
        break;
      case 'GAME_LOG':
        AgentLog.add(`[Game] ${payload.message}`, payload.level || 'info');
        break;
      case 'GAME_OVER':
        AgentLog.add('Game over — score: ' + (payload.score || 'N/A'), 'info');
        break;
      default:
        // Unknown message type — ignore
        break;
    }
  },

  handleError(payload) {
    const msg = `Runtime error: ${payload.errorStack || 'unknown'}` +
      (payload.fileRef ? ` in ${payload.fileRef}:${payload.line || '?'}` : '');
    AgentLog.error(msg);
    // Future: trigger automated agent debugging
  },

  handleAssetClick(payload) {
    if (payload && payload.filePath) {
      AgentLog.add(`Selected asset: ${payload.filePath}`, 'info');
      // Future: highlight in file explorer / prefill chat
    }
  },

  // Send a message to the game iframe
  postToFrame(data) {
    const frame = document.getElementById('previewFrame');
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage(data, '*');
    }
  },

  // Inject error interceptor + FPS reporter into loaded game
  injectInterceptors(iframeWindow) {
    const script = `
      // Auto-send FPS updates
      let _frameCount = 0, _lastFpsTime = performance.now();
      function _fpsLoop() {
        _frameCount++;
        const now = performance.now();
        if (now - _lastFpsTime >= 1000) {
          parent.postMessage({ type: 'FPS_UPDATE', payload: { fps: _frameCount } }, '*');
          _frameCount = 0;
          _lastFpsTime = now;
        }
        requestAnimationFrame(_fpsLoop);
      }
      if (typeof requestAnimationFrame !== 'undefined') _fpsLoop();

      // Intercept errors and forward to bridge
      window.onerror = function(message, source, lineno, colno, error) {
        parent.postMessage({
          type: 'RUNTIME_EXCEPTION_DETECTED',
          payload: {
            errorStack: error ? error.stack : message,
            fileRef: source,
            line: lineno
          }
        }, '*');
        return true;
      };

      // Notify parent that game is ready
      parent.postMessage({ type: 'GAME_READY', payload: {} }, '*');
    `;

    try {
      // Inject directly into the loaded game
      const blob = new Blob([`
        (function() {
          ${script}
        })();
      `], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);

      // Wait for frame load then inject
      document.getElementById('previewFrame').addEventListener('load', () => {
        try {
          const frameDoc = document.getElementById('previewFrame').contentWindow;
          if (frameDoc) {
            frameDoc.eval(script);
          }
        } catch (e) {
          // Cross-origin restrictions on eval — bridge will still work for same-origin
          Bridge.status('Bridge: cross-origin (eval blocked)');
        }
      });
    } catch (e) {
      // Fallback: bridge works via postMessage even without injectors
      Bridge.status('Bridge: limited mode');
    }
  },

  status(msg) {
    AgentLog.add(`[Bridge] ${msg}`, 'info');
  }
};
