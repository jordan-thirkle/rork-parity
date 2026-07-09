import fs from 'fs';
import path from 'path';

export interface ExpoProjectResult {
  outputPath: string;
  files: Record<string, string>;
}

const DEFAULT_FILES: Record<string, string> = {
  'app.json': JSON.stringify({
    expo: {
      name: 'rork-parity-app',
      slug: 'rork-parity-app',
      version: '1.0.0',
      orientation: 'portrait',
      platform: ['ios', 'android', 'web'],
      scheme: 'rork-parity-app',
      ios: { supportsTablet: true },
      android: { adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#000000' } },
      web: { favicon: './assets/favicon.png' },
      extra: { eas: { projectId: 'replace-me' } },
    },
  }, null, 2),
  'package.json': JSON.stringify({
    name: 'rork-parity-app',
    version: '1.0.0',
    main: 'expo-router/entry',
    scripts: { start: 'expo start', android: 'expo start --android', ios: 'expo start --ios', web: 'expo start --web' },
    dependencies: { expo: '~52.0.0', 'expo-router': '~5.0.0', react: '19.0.0', 'react-native': '0.76.0' },
    devDependencies: { '@babel/core': '^7.26.0', typescript: '~5.3.0' },
  }, null, 2),
  'tsconfig.json': JSON.stringify({
    compilerOptions: { target: 'ESNext', lib: ['ESNext'], module: 'ESNext', moduleResolution: 'bundler', allowJs: true, jsx: 'react-jsx', strict: true, noEmit: true, isolatedModules: true },
    include: ['**/*.ts', '**/*.tsx', '.expo/types/**/*.ts', 'expo-env.d.ts'],
    extends: 'expo/tsconfig.base/tsconfig.json',
  }, null, 2),
  'app/_layout.tsx': `import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
`,
  'app/index.tsx': `import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RorkParity App</Text>
      <Text style={styles.subtitle}>Generated from prompt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#a3a3a3', marginTop: 8 },
});
`,
};

function sanitizePromptToSlug(prompt: string): string {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'generated';
}

export function generateExpoProject(prompt: string): ExpoProjectResult {
  const slug = sanitizePromptToSlug(prompt);
  const root = path.join(process.cwd(), '.generated', `expo-${slug}-${Date.now()}`);
  const files: Record<string, string> = { ...DEFAULT_FILES };

  const screenName = 'GeneratedScreen';
  files['app/' + screenName + '.tsx'] = `import { View, Text, StyleSheet } from 'react-native';

export default function ${screenName}() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${prompt.replace(/"/g, '\\"')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 22, fontWeight: '600' },
});
`;

  for (const [relative, content] of Object.entries(files)) {
    const full = path.join(root, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, 'utf8');
  }

  return { outputPath: root, files };
}

export function validateExpoProject(outputPath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const required = ['app.json', 'package.json', 'tsconfig.json', 'app/_layout.tsx', 'app/index.tsx'];

  for (const file of required) {
    if (!fs.existsSync(path.join(outputPath, file))) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  const packageJsonPath = path.join(outputPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (!pkg.dependencies?.expo || !pkg.dependencies?.react || !pkg.dependencies?.['react-native']) {
        errors.push('package.json missing required dependencies: expo, react, react-native');
      }
    } catch {
      errors.push('package.json is not valid JSON');
    }
  }

  return { valid: errors.length === 0, errors };
}
