/**
 * Real Expo / React Native project generator for RorkParity.
 * Returns a file map (Record<string, string>) of a minimal but REAL
 * React Native + Expo project that runs with `npx expo start`.
 *
 * Keyword routing (case-insensitive), mirrors generators/game-generator.ts:
 *   brawler | fight        -> arena brawler (tap to attack, HP, score)
 *   shooter                -> top-down shooter (auto-fire, move via tilt-ish buttons)
 *   idle | rpg | clicker   -> gold clicker (tap orb, passive income)
 *   3d | cube | rotate     -> auto-rotating pseudo-3D cube (Animated)
 *   default                -> generic collect-the-orb mini-game
 *
 * Every file is a plain string. No external CDN, no extra deps.
 */

const ACCENT = '#F97316'; // orange

type Category = 'brawler' | 'shooter' | 'idle' | '3d' | 'generic';

function routeCategory(prompt: string): Category {
  const p = (prompt || '').toLowerCase();
  if (/\b(brawler|fight|fighting|arena)\b/.test(p)) return 'brawler';
  if (/\bshoot(er|ing)?\b/.test(p)) return 'shooter';
  if (/\b3d\b|\bcube\b|\brotat/.test(p)) return '3d';
  if (/\b(idle|rpg|clicker|tycoon)\b/.test(p)) return 'idle';
  return 'generic';
}

function brawlerApp(): string {
  return `import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const ACCENT = '${ACCENT}';

export default function App() {
  const [player, setPlayer] = useState({ x: width / 2, y: height / 2, hp: 100, score: 0 });
  const [enemies, setEnemies] = useState([]);

  useEffect(() => {
    const id = setInterval(() => {
      setEnemies((prev) => {
        const next = prev
          .map((e) => {
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const d = Math.hypot(dx, dy) || 1;
            return { ...e, x: e.x + (dx / d) * 1.4, y: e.y + (dy / d) * 1.4 };
          })
          .filter((e) => {
            const hit = Math.hypot(e.x - player.x, e.y - player.y) < 30;
            if (hit) {
              setPlayer((p) => ({ ...p, hp: Math.max(0, p.hp - 0.4) }));
              return false;
            }
            return true;
          });
        if (Math.random() < 0.06) {
          next.push({ id: Math.random(), x: Math.random() < 0.5 ? 0 : width, y: Math.random() * height, hp: 3 });
        }
        return next;
      });
    }, 1000 / 30);
    return () => clearInterval(id);
  }, [player.x, player.y]);

  function attack() {
    setEnemies((prev) =>
      prev
        .map((e) => (Math.hypot(e.x - player.x, e.y - player.y) < 90 ? { ...e, hp: e.hp - 1 } : e))
        .filter((e) => {
          if (e.hp <= 0) {
            setPlayer((p) => ({ ...p, score: p.score + 10 }));
            return false;
          }
          return true;
        })
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hud}>HP {Math.max(0, Math.round(player.hp))}   Score {player.score}</Text>
      <View style={[styles.player, { left: player.x - 16, top: player.y - 16 }]} />
      {enemies.map((e) => (
        <View key={e.id} style={[styles.enemy, { left: e.x - 12, top: e.y - 12 }]} />
      ))}
      <Pressable style={styles.attackBtn} onPress={attack}>
        <Text style={styles.attackText}>ATTACK</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', position: 'relative' },
  hud: { color: '#fff', fontSize: 16, fontFamily: 'monospace', padding: 14 },
  player: { position: 'absolute', width: 32, height: 32, borderRadius: 16, backgroundColor: ACCENT },
  enemy: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#ef4444' },
  attackBtn: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  attackText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
`;
}

function shooterApp(): string {
  return `import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const ACCENT = '${ACCENT}';

export default function App() {
  const [player, setPlayer] = useState({ x: width / 2, y: height - 80, hp: 100, score: 0 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);

  useEffect(() => {
    const id = setInterval(() => {
      setBullets((b) => b.map((x) => ({ ...x, y: x.y - 7 })).filter((x) => x.y > -20));
      setEnemies((prev) => {
        let scored = 0;
        const next = prev
          .map((e) => ({ ...e, y: e.y + 1.4 }))
          .filter((e) => {
            const hit = bullets.some((b) => Math.hypot(b.x - e.x, b.y - e.y) < 18);
            if (hit) { scored += 10; return false; }
            if (e.y > height + 20) return false;
            if (Math.hypot(e.x - player.x, e.y - player.y) < 28) {
              setPlayer((p) => ({ ...p, hp: Math.max(0, p.hp - 0.5) }));
              return false;
            }
            return true;
          });
        if (scored) setPlayer((p) => ({ ...p, score: p.score + scored }));
        if (Math.random() < 0.05) {
          next.push({ id: Math.random(), x: Math.random() * width, y: -20 });
        }
        return next;
      });
      setBullets((b) => [...b, { id: Math.random(), x: player.x, y: player.y - 16 }]);
    }, 1000 / 30);
    return () => clearInterval(id);
  }, [player.x, player.y, bullets]);

  function move(dir) {
    setPlayer((p) => ({ ...p, x: Math.max(16, Math.min(width - 16, p.x + dir * 24)) }));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hud}>HP {Math.max(0, Math.round(player.hp))}   Score {player.score}</Text>
      {bullets.map((b) => (
        <View key={b.id} style={[styles.bullet, { left: b.x - 3, top: b.y - 8 }]} />
      ))}
      {enemies.map((e) => (
        <View key={e.id} style={[styles.enemy, { left: e.x - 12, top: e.y - 12 }]} />
      ))}
      <View style={[styles.player, { left: player.x - 14, top: player.y - 12 }]} />
      <View style={styles.controls}>
        <Text style={styles.ctrl} onPress={() => move(-1)}>◀</Text>
        <Text style={styles.ctrl} onPress={() => move(1)}>▶</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', position: 'relative' },
  hud: { color: '#fff', fontSize: 16, fontFamily: 'monospace', padding: 14 },
  bullet: { position: 'absolute', width: 6, height: 16, backgroundColor: ACCENT },
  enemy: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#ef4444' },
  player: { position: 'absolute', width: 28, height: 24, backgroundColor: ACCENT },
  controls: { position: 'absolute', bottom: 28, width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
  ctrl: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
});
`;
}

function idleApp(): string {
  return `import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const ACCENT = '${ACCENT}';

export default function App() {
  const [gold, setGold] = useState(0);
  const [gps, setGps] = useState(0);
  const [lvl, setLvl] = useState(1);
  const [cost, setCost] = useState(15);

  const tick = () => {
    if (gps > 0) setGold((g) => g + gps);
  };
  // passive income loop
  setInterval(tick, 1000);

  function tap() {
    setGold((g) => g + 1);
  }
  function upgrade() {
    if (gold >= cost) {
      setGold((g) => g - cost);
      setGps((g) => g + 1);
      setLvl((l) => l + 1);
      setCost((c) => Math.floor(c * 1.6));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hud}>Gold: {Math.floor(gold)}</Text>
      <Text style={styles.sub}>Gold/sec: {gps}   Lvl {lvl}</Text>
      <Pressable style={styles.orb} onPress={tap}>
        <Text style={styles.orbText}>TAP</Text>
      </Pressable>
      <Pressable
        style={[styles.upgrade, { backgroundColor: gold >= cost ? ACCENT : '#555' }]}
        onPress={upgrade}
      >
        <Text style={styles.upgradeText}>Upgrade ({cost}g) +1/s</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', gap: 18 },
  hud: { color: '#fff', fontSize: 28, fontFamily: 'monospace' },
  sub: { color: '#fff', fontSize: 14, fontFamily: 'monospace' },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbText: { color: '#000', fontWeight: 'bold', fontSize: 20 },
  upgrade: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  upgradeText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
});
`;
}

function cube3dApp(): string {
  return `import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const ACCENT = '${ACCENT}';
const PTS = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];
const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

export default function App() {
  const spin = useState(new Animated.Value(0))[0];
  const [t, setT] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: false })
    ).start();
    const id = setInterval(() => setT((v) => v + 0.02), 1000 / 30);
    return () => clearInterval(id);
  }, []);

  const angle = (spin as any).__getValue ? (spin as any).__getValue() * Math.PI * 2 : 0;
  const ca = Math.cos(angle), sa = Math.sin(angle), cb = Math.cos(angle * 0.7), sb = Math.sin(angle * 0.7);
  const cx = 120, cy = 160, sc = 90;
  const proj = PTS.map((p) => {
    const [X, Y, Z] = p;
    const x1 = X * ca - Z * sa, z1 = X * sa + Z * ca;
    const x2 = x1 * cb - z1 * sb, z2 = x1 * sb + z1 * cb;
    return { x: cx + x2 * sc, y: cy + Y * sc, z: z2 };
  });

  return (
    <View style={styles.container}>
      <View style={styles.stage}>
        {EDGES.map(([a, b], i) => {
          const pa = proj[a], pb = proj[b];
          const dx = pb.x - pa.x, dy = pb.y - pa.y;
          const len = Math.hypot(dx, dy);
          const rot = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <View
              key={i}
              style={[
                styles.edge,
                {
                  width: len,
                  left: pa.x,
                  top: pa.y,
                  transform: [{ rotate: rot + 'deg' }],
                },
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.hud}>rotate: {angle.toFixed(2)} rad</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', gap: 12 },
  stage: { width: 240, height: 320, position: 'relative' },
  edge: { position: 'absolute', height: 3, backgroundColor: ACCENT, transformOrigin: 'left center' },
  hud: { color: '#fff', fontSize: 14, fontFamily: 'monospace' },
});
`;
}

function genericApp(): string {
  return `import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const ACCENT = '${ACCENT}';

export default function App() {
  const [player, setPlayer] = useState({ x: width / 2, y: height / 2, score: 0 });
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const id = setInterval(() => {
      setCoins((prev) => {
        const filtered = prev
          .map((c) => ({ ...c, life: c.life - 1 }))
          .filter((c) => {
            if (c.life <= 0) return false;
            if (Math.hypot(c.x - player.x, c.y - player.y) < 24) {
              setPlayer((p) => ({ ...p, score: p.score + 1 }));
              return false;
            }
            return true;
          });
        if (filtered.length < 6 && Math.random() < 0.08) {
          filtered.push({ id: Math.random(), x: Math.random() * width, y: Math.random() * height, life: 240 });
        }
        return filtered;
      });
    }, 1000 / 30);
    return () => clearInterval(id);
  }, [player.x, player.y]);

  function move(dx, dy) {
    setPlayer((p) => ({
      ...p,
      x: Math.max(12, Math.min(width - 12, p.x + dx)),
      y: Math.max(12, Math.min(height - 12, p.y + dy)),
    }));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hud}>Score {player.score}</Text>
      {coins.map((c) => (
        <View key={c.id} style={[styles.coin, { left: c.x - 10, top: c.y - 10 }]} />
      ))}
      <View style={[styles.player, { left: player.x - 12, top: player.y - 12 }]} />
      <View style={styles.controls}>
        <Text style={styles.ctrl} onPress={() => move(0, -24)}>▲</Text>
        <View style={styles.row}>
          <Text style={styles.ctrl} onPress={() => move(-24, 0)}>◀</Text>
          <Text style={styles.ctrl} onPress={() => move(24, 0)}>▶</Text>
        </View>
        <Text style={styles.ctrl} onPress={() => move(0, 24)}>▼</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', position: 'relative' },
  hud: { color: '#fff', fontSize: 16, fontFamily: 'monospace', padding: 14 },
  coin: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: ACCENT },
  player: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' },
  controls: { position: 'absolute', bottom: 28, width: '100%', alignItems: 'center', gap: 4 },
  row: { flexDirection: 'row', gap: 32 },
  ctrl: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
});
`;
}

function packageJson(): string {
  return JSON.stringify(
    {
      name: 'RorkParityApp',
      version: '1.0.0',
      main: 'node_modules/expo/AppEntry.js',
      scripts: {
        start: 'expo start',
        android: 'expo start --android',
        ios: 'expo start --ios',
        web: 'expo start --web',
      },
      dependencies: {
        expo: '~51.0.0',
        'expo-status-bar': '~1.12.1',
        react: '18.2.0',
        'react-native': '0.74.5',
      },
      private: true,
    },
    null,
    2
  ) + '\n';
}

function appJson(): string {
  return JSON.stringify(
    {
      expo: {
        name: 'RorkParityApp',
        slug: 'rorkparity-app',
        version: '1.0.0',
        orientation: 'portrait',
        userInterfaceStyle: 'dark',
        splash: {
          resizeMode: 'contain',
          backgroundColor: '#0a0a0a',
        },
        assetBundlePatterns: ['**/*'],
        ios: {
          supportsTablet: true,
          bundleIdentifier: 'com.rorkparity.app',
        },
        android: {
          package: 'com.rorkparity.app',
        },
        web: {
          favicon: './assets/favicon.png',
        },
      },
    },
    null,
    2
  ) + '\n';
}

function readme(): string {
  return `# RorkParityApp

A real React Native + Expo project generated by RorkParity.

## Run

\`\`\`bash
npm install
npx expo start
\`\`\`

Then open the app with:

- **Expo Go** on your phone (scan the QR code), or
- an Android emulator / iOS simulator, or
- press \`w\` to run in the browser.

## Files

- \`App.tsx\` — the game screen (keyword-routed by your prompt).
- \`app.json\` — Expo configuration.
- \`package.json\` — dependencies (expo, react, react-native).

Brand: RorkParity. Accent color \`#F97316\`.
`;
}

function babelConfig(): string {
  return `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
`;
}

function tsConfig(): string {
  return JSON.stringify(
    {
      extends: 'expo/tsconfig.base',
      compilerOptions: {
        strict: true,
      },
    },
    null,
    2
  ) + '\n';
}

/**
 * Generate a minimal but REAL React Native + Expo project keyed off a prompt.
 * Returns a file map (relative path -> file contents).
 */
export function generateExpoProject(prompt: string): Record<string, string> {
  const category = routeCategory(prompt);
  let appTsx: string;
  switch (category) {
    case 'brawler':
      appTsx = brawlerApp();
      break;
    case 'shooter':
      appTsx = shooterApp();
      break;
    case 'idle':
      appTsx = idleApp();
      break;
    case '3d':
      appTsx = cube3dApp();
      break;
    default:
      appTsx = genericApp();
  }

  return {
    'App.tsx': appTsx,
    'package.json': packageJson(),
    'app.json': appJson(),
    'README.md': readme(),
    'babel.config.js': babelConfig(),
    'tsconfig.json': tsConfig(),
  };
}
