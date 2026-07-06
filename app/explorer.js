// ============ EXPLORER ============
// File/asset tree panel

const Explorer = {
  el: null,
  bodyEl: null,

  init() {
    this.el = document.getElementById('explorerPane');
    this.bodyEl = document.getElementById('explorerBody');
  },

  setFiles(files) {
    State.files = files || [];
    this.render();
  },

  render() {
    if (!State.files || State.files.length === 0) {
      this.bodyEl.innerHTML = '<div class="explorer-empty"><span class="text-muted">Generate a game to see project files.</span></div>';
      return;
    }
    this.bodyEl.innerHTML = '';
    const groups = this.groupByType(State.files);
    groups.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'tree-group';
      groupEl.textContent = group.name;
      this.bodyEl.appendChild(groupEl);
      group.items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'tree-item';
        const icon = this.iconFor(item);
        el.innerHTML = `<span class="tree-icon">${icon}</span><span class="tree-name">${item.name}</span>${item.size ? `<span class="tree-size">${item.size}</span>` : ''}`;
        el.addEventListener('click', () => {
          document.querySelectorAll('.tree-item.active').forEach(a => a.classList.remove('active'));
          el.classList.add('active');
          if (item.action) item.action(item);
        });
        this.bodyEl.appendChild(el);
      });
    });
  },

  addFile(item) {
    State.files.push(item);
    this.render();
  },

  groupByType(files) {
    const groups = {
      scripts: { name: 'Scripts', items: [] },
      scenes: { name: 'Scenes/Levels', items: [] },
      assets: { name: 'Assets', items: [] }
    };
    files.forEach(f => {
      const ext = f.name ? f.name.split('.').pop().toLowerCase() : '';
      if (['js', 'ts', 'mjs'].includes(ext)) groups.scripts.items.push(f);
      else if (['json'].includes(ext)) groups.scenes.items.push(f);
      else groups.assets.items.push(f);
    });
    return Object.values(groups).filter(g => g.items.length > 0);
  },

  iconFor(item) {
    const ext = item.name ? item.name.split('.').pop().toLowerCase() : '';
    if (['js', 'ts', 'mjs'].includes(ext)) return '📄';
    if (['html', 'htm'].includes(ext)) return '🌐';
    if (['css'].includes(ext)) return '🎨';
    if (['json'].includes(ext)) return '📋';
    if (['png', 'jpg', 'gif', 'svg', 'webp'].includes(ext)) return '🖼';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return '🔊';
    if (['glb', 'gltf', 'obj', 'fbx'].includes(ext)) return '🧊';
    return '📁';
  }
};
