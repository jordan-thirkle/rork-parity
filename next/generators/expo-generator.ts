import { promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export async function validateExpoProject(dir: string) {
  const files = ['app.json', 'package.json', 'tsconfig.json', 'app/_layout.tsx', 'app/index.tsx'];
  for (const file of files) {
    const full = path.join(dir, file);
    try {
      await fs.access(full);
    } catch {
      return false;
    }
  }
  return true;
}

export async function createExpoProject(options: { prompt: string; outDir?: string }) {
  const prompt = String(options.prompt ?? '');
  const outDir = options.outDir ?? process.env.TMPDIR ?? '/tmp';
  const projectDir = path.join(outDir, `rork-parity-${randomUUID()}`);
  await fs.mkdir(projectDir, { recursive: true });
  await fs.mkdir(path.join(projectDir, 'app'), { recursive: true });

  const appJson = {
    expo: {
      name: 'RorkParity Game',
      slug: 'rork-parity-game',
      version: '1.0.0',
      orientation: 'portrait',
      platforms: ['ios', 'android', 'web'],
      sdkVersion: '51.0.0',
    },
  };

  const packageJson = {
    name: 'rork-parity-game',
    version: '1.0.0',
    main: 'expo-router/entry',
    dependencies: {
      expo: '~51.0.0',
      'expo-status-bar': '~1.12.0',
      react: '18.2.0',
      'react-native': '0.74.1',
      'expo-three': '~8.0.0',
      three: '0.160.0',
      'expo-gl': '~14.0.0',
      'react-native-game-engine': '1.2.2',
    },
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
    },
  };

  const tsConfig = {
    extends: 'expo/tsconfig.base',
    compilerOptions: {
      strict: true,
      jsx: 'react-native',
    },
  };

  const layoutTsx = `import { Stack } from 'expo-router';\nexport default function RootLayout() {\n  return <Stack screenOptions={{ headerShown: false }} />;\n}\n`;

  const screenName = prompt.toLowerCase().includes('brawler') ? 'Brawler' : 'Game';
  const indexTsx = `import React from 'react';\nimport { View, Text, StyleSheet } from 'react-native';\n\nexport default function ${screenName}Screen() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.title}>RorkParity</Text>\n      <Text style={styles.subtitle}>${prompt.slice(0, 120)}</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },\n  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },\n  subtitle: { fontSize: 14, opacity: 0.7, paddingHorizontal: 24, textAlign: 'center' },\n});\n`;

  await fs.writeFile(path.join(projectDir, 'app.json'), JSON.stringify(appJson, null, 2));
  await fs.writeFile(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  await fs.writeFile(path.join(projectDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
  await fs.writeFile(path.join(projectDir, 'app/_layout.tsx'), layoutTsx);
  await fs.writeFile(path.join(projectDir, 'app/index.tsx'), indexTsx);

  return {
    projectDir,
    valid: await validateExpoProject(projectDir),
  };
}
