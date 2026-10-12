# OurSpace — Private Family iOS App

OurSpace is an **iOS-only** family companion built with Expo + React Native. Planned features include a shared calendar, tasks and shopping lists, goals, memories, invited family profiles, and offline-first synchronization.

**Current status: v0.6 source preparation.** This repository is being initialized. Do not treat it as an installable iPhone build. No signed IPA, live family backend, or verified multi-device synchronization exists yet.

## Architecture
- iOS: Expo Router, React Native, TypeScript, SQLite + SQLCipher, SecureStore
- Private backend source: Node.js + Fastify + PostgreSQL
- Build workflow: Expo EAS
- **No Supabase. No Firebase. No Android target.**

## Important privacy notice
This is a **public code repository**. Never commit family photos, real family data, accounts, API tokens, Apple certificates, provisioning profiles, or passwords. The Safari demo is public and must only contain example data.

## Build preparation
1. Install dependencies with `npm install`.
2. Validate with `npx expo install --check`, `npx expo-doctor`, `npm run preflight`, and `npm test`.
3. Link an Expo project with `eas init`; authenticate using your own Expo/Apple accounts.
4. Register the iPhone with `eas device:create`.
5. Build an installable internal test with `eas build --platform ios --profile preview`.

**The private backend must be separately deployed and security-tested before actual family synchronization can be enabled.**

Prototype: https://ourspace-ios-preview.vercel.app

© OurSpace.

## Import the prepared v0.6 source

The GitHub integration can create and edit text files but cannot upload the existing binary source archive directly. To complete the source import using **one upload**, download the exact archive `OurSpace-iOS-v0.6-EAS-Prepared-Source.zip` from the ChatGPT conversation, then open this repository and choose **Add file → Upload files**. Upload the ZIP without unzipping it. The pinned [source import workflow](.github/workflows/import-source.yml) will unpack and validate the app files, commit the source tree, and delete the ZIP from the branch. Watch the **Actions** tab and confirm it finishes green.

**Until the importer has finished successfully, this repository only contains project scaffolding and is not buildable.** The upload archive is created from the same source as the previously shared 0.6 package, contains no user data, and has been scanned for credential patterns. Do not upload a private/family-data ZIP or certificates.

The import workflow runs only on a push containing the exact archive name. The later iPhone installable build still requires Expo EAS association and Apple signing.
