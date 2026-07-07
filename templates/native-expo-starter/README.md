# RorkParity — native-expo-starter

First production-ready native export template. This is a real Expo/React Native project with physics-capable scene wiring, build scripts, and typed configuration.

## What this template proves
- Valid `app.json` + `package.json` for Expo/Android/iOS builds
- Real native deps: `expo-three`, `expo-gl`, `cannon-es`, `three`
- Working render loop scaffold in `app/GameScene.tsx`
- TypeScript-ready config

## Use
1. Copy `templates/native-expo-starter` into a new repo.
2. Run `npm install`.
3. Run `npx expo start` for dev.
4. For store builds: connect EAS and run `eas build`.

## Next
- Attach chat-generated asset injection
- Add template marketplace manifest entry
- Add build verification job in autonomous pipeline
