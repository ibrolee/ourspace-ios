# OurSpace — Private Family iOS App

**Public source repository · iOS only · Expo SDK 57**

A premium, offline-first iPhone family companion for planning events, managing tasks and checklists, saving text memories, tracking shared goals, and creating family profiles.

> **Current status:** Native app source and build configuration are committed. There is **no signed iPhone IPA or TestFlight build**, and **no live private family server**. iOS functionality has not been tested on a physical device.

## What works in the native source

- First-run setup and family-space naming
- Home, Calendar, Plans, Memories and Family tabs
- Offline SQLite CRUD for events, tasks, lists, goals and text memories
- Local family profiles (these are not invited accounts)
- A Face ID / device authentication app-lock option
- SQLCipher-encrypted SQLite database configuration, with a fail-closed startup check if SQLCipher is missing
- Internal EAS preview build profile for registered iPhones

Only local storage is implemented in this GitHub version. Family labels are **not** active cross-device sharing permissions.

## Technology

Expo + React Native + Expo Router + TypeScript + encrypted SQLite + SecureStore. No Supabase, no Firebase, no Android.

## Build validation

```bash
npm install
npm run preflight
npm run typecheck
npm test
npx expo install --check
npx expo-doctor
npx expo prebuild --platform ios --no-install
```

Source validation and iOS prebuild can run in a cloud/Linux environment; only an Apple-signed EAS build can establish whether it installs and launches on a real iPhone.

## Install on an iPhone (requires your Apple / Expo account)

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest device:create
npx eas-cli@latest build --platform ios --profile preview
```

The first three actions may require account authorization and iPhone registration. Do not commit Apple credentials, signing files or any personal family information.

## What's not ready yet

- Cloud accounts / invitation codes / real family permissions
- Cross-device synchronization / server hosting / backups
- Photo or video albums, notifications and shared media
- On-device security verification and App Store submission

The pre-existing v0.6 ZIP contains additional experimental private API components and media assets that **have not been imported to this repository**. Do not interpret the presence of a local family label as evidence that the private API is active.

Interactive Safari *design demo* (not a native app): https://ourspace-ios-preview.vercel.app

**Privacy:** This repository is PUBLIC. Keep all real family data, photographs, documents, tokens, environment secrets and Apple signing material outside the repository.
