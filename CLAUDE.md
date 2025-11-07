# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native example application (built with Expo 54) that demonstrates integration with two ExpoFP SDKs:
- `@expofp/react-native-efp-sdk` - Interactive map display and floor plan visualization
- `@expofp/react-native-efp-crowdconnected` - Location provider integration using CrowdConnected for real-time location tracking

The app runs on iOS and Android, showcasing location tracking, map interactions, and permission handling patterns.

## Common Development Commands

```bash
# Development
npm start                  # Start Expo dev server (interactive - choose platform)
npm run ios               # Build and run iOS app with Xcode
npm run android           # Build and run Android app with emulator/device

# Build and Native Code Generation
npm run expo:prebuild     # Generate native code from Expo configuration
npm run prebuild          # Reset watchman cache and generate native code (use if prebuild fails)

# Code Quality
npm lint                  # Run ESLint to check code quality
npm run web              # Start web development server (for web testing)

# Reset and Clean
npm run reset-project    # Reset project to clean state (note: references a script file that doesn't exist - may need fixing)
```

## Architecture Overview

### Application Entry Point

The app uses **Expo Router** for file-based routing:
- `app/index.tsx` - Root router page
- `components/App.tsx` - Main application component containing all core logic

### Core Components and Responsibilities

**App.tsx** is the monolithic main component that handles:
1. **Permission Management** - Foreground location, background location (Android), and Bluetooth permissions
2. **SDK Initialization** - CrowdConnectedLocationProvider setup with credentials and configuration
3. **Location Tracking** - Start/stop location tracking with background mode toggle
4. **Map Integration** - Two ExpofpView instances (one with location provider, one static demo map)
5. **UI State Management** - Multiple useState hooks for permissions, initialization, tracking status, and floor plan selection
6. **User Controls** - Initialize SDK, start/stop tracking, toggle background mode, switch floor plans (demo vs cloudnext25)

### Key Technical Patterns

**CrowdConnected Location Provider Setup:**
- Initialized with hardcoded credentials (appKey, token, secret)
- Configured with navigation type, background updates, Bluetooth, and heading support
- Can be toggled for background updates without full reinitialization

**Permission Handling:**
- Platform-aware checks (Android vs iOS)
- Android-specific: API level 31+ for Bluetooth permissions
- Separate foreground and background location permission flows
- Visual status indicators in UI

**Map Instance Pattern:**
- Two separate `ExpofpView` components demonstrating different use cases
- First map: Integrated with CrowdConnectedLocationProvider for tracking
- Second map: Static "demo" floor plan without tracking
- Maps can be controlled via refs (zoom, fitBounds operations)

**Feature Toggles:**
- Floor plan switching between "demo" and "cloudnext25" via expoKey prop
- Background mode toggle (affects SDK behavior without reinit)
- Permission conditional rendering

### State Management

The app uses React hooks for local state. No global state manager (Redux, Context API, Zustand) is configured. All state is managed within the App component:

```typescript
// Permission states
const [foregroundPermission, setForegroundPermission] = useState(false)
const [backgroundPermission, setBackgroundPermission] = useState(false)
const [bluetoothPermission, setBluetoothPermission] = useState(false)

// SDK states
const [isInitialized, setIsInitialized] = useState(false)
const [isTracking, setIsTracking] = useState(false)
const [isBackgroundMode, setIsBackgroundMode] = useState(false)
const [floorPlanIndex, setFloorPlanIndex] = useState(0)

// Map refs for imperative control
const apiRef = useRef(null)
```

## Technology Stack

**Core Frameworks:**
- React 19.1.0 with React 19 features
- React Native 0.81.4 (latest stable)
- Expo 54.0.12 for development and deployment
- Expo Router 6.0.10 for file-based routing

**UI & Navigation:**
- React Navigation 7.x with bottom tabs support
- React Native Gesture Handler 2.28.0
- React Native Reanimated 4.1.1 for animations
- React Native Safe Area Context 5.6.0

**Maps & Location:**
- ExpoFP SDK (@expofp/react-native-efp-sdk)
- CrowdConnected Location Provider (@expofp/react-native-efp-crowdconnected)
- React Native Worklets 0.5.1 for performance

**Styling:**
- React Native StyleSheet (no styled-components or Tailwind)
- Platform-specific styles for iOS/Android consistency

**Development:**
- TypeScript 5.9.2 with strict mode enabled
- ESLint 9.25.0 with expo config
- Metro Bundler (via Expo) for bundling

## Project Configuration

**TypeScript:**
- Extends `expo/tsconfig.base` in strict mode
- Path aliases configured: `@/*` maps to project root
- Strict null checks and noImplicitAny enabled

**Build Configuration:**
- **app.json** - Expo configuration with:
  - Adaptive icons for Android (API 33+)
  - iOS bundle identifiers and tablet support
  - React Compiler enabled for optimizations
  - Typed Routes enabled
  - Web static output
- **tsconfig.json** - TypeScript settings with alias paths
- **eslint.config.js** - ESLint rules based on Expo config
- **.vscode/settings.json** - VS Code auto-linting and import organization on save

**Native Build:**
- **iOS** - CocoaPods dependency management (Podfile), Xcode project configuration
- **Android** - Gradle build system with app module structure

## Integration Notes

### ExpoFP SDK Integration

The ExpoFP SDK is tightly integrated into the App component:
- `ExpofpView` requires location provider and expoKey props
- Map operations (zoom, fitBounds) use refs and imperative API calls
- Location provider must be initialized before SDK is functional

### CrowdConnected Setup Requirements

The location provider requires:
1. Valid credentials (appKey, token, secret)
2. Permission grants (foreground/background location, Bluetooth)
3. Proper platform configuration in native code (iOS/Android build artifacts)

Current credentials in code appear to be demo/test credentials - production apps need proper credentials.

### Permission Flow

1. **Android**: Check foreground location → Bluetooth (API 31+) → Background location
2. **iOS**: Request foreground location → Background location toggle
3. Permissions must be granted before tracking can start
4. SDK behavior depends on granted permissions

## Known Limitations & TODOs

- No testing infrastructure (no Jest, test files, or test utilities)
- App.tsx is a monolithic component - could benefit from component extraction
- State management is local component state - scaling could require state management library
- `reset-project` script references non-existent file
- No error handling for SDK initialization failures
- No loading states during permission requests

## Browser/Web Support

React Native Web is configured for web support:
- Run with `npm run web` for web development
- Responsive styling works on web
- Map components may have limited functionality on web

## Environment & Setup

- Requires Node.js and npm
- Watchman recommended for file watching (especially on macOS)
- XCode required for iOS development
- Android Studio or Android SDK required for Android development
- Expo dev tools help with platform-specific debugging
