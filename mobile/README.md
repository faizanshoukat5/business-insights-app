# Business Insights — Mobile App (Expo React Native + TypeScript)

See the root README for full documentation.

## Quick start

```bash
npm install
npx expo start   # scan the QR code with Expo Go
```

## Android APK

```bash
eas build -p android --profile preview
```

The API base URL comes from `EXPO_PUBLIC_API_URL` (see `.env.example`); it defaults to the deployed Render API when unset.
