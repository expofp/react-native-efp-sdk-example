# React Native ExpoFP SDK Example

A comprehensive example application demonstrating how to integrate and use the ExpoFP SDKs for interactive floor plan visualization and real-time location tracking in React Native applications.

## Overview

This example showcases:
- **Interactive Floor Plans** - Display and interact with customizable floor plans using [@expofp/react-native-efp-sdk](https://www.npmjs.com/package/@expofp/react-native-efp-sdk)
- **Real-time Location Tracking** - Integrated location provider using [@expofp/react-native-efp-crowdconnected](https://www.npmjs.com/package/@expofp/react-native-efp-crowdconnected)
- **Cross-platform Support** - Runs on iOS and Android with a shared codebase using Expo and React Native
- **Permission Management** - Proper handling of location and Bluetooth permissions
- **Background Tracking** - Support for background location updates

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) and **npm**
- **Expo CLI** - Install with `npm install -g expo-cli`
- **Xcode** (for iOS development) or **Android Studio** (for Android development)
- **Watchman** (recommended for macOS file watching)

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/expofp/react-native-efp-sdk-example.git
cd react-native-efp-sdk-example
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure CrowdConnected credentials
Create `config/crowdconnected.ts` from the example:
```bash
cp config/crowdconnected.example.ts config/crowdconnected.ts
```

Edit `config/crowdconnected.ts` and add your CrowdConnected credentials:
```typescript
export const CROWDCONNECTED_CONFIG = {
  appKey: "YOUR_APP_KEY",
  token: "YOUR_TOKEN",
  secret: "YOUR_SECRET",
  // ... other config
};
```

### 4. Generate native code
```bash
npm run expo:prebuild
```

### 5. Run the app

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## Available Scripts

```bash
# Development
npm start              # Start Expo development server
npm run ios           # Build and run on iOS
npm run android       # Build and run on Android
npm run web           # Start web development server

# Build & Native
npm run expo:prebuild # Generate native iOS/Android code
npm run prebuild      # Clean rebuild with watchman reset

# Code Quality
npm run lint              # Run ESLint
```

## Configuration

### iOS Info.plist

The following permissions are configured in `app.json` for iOS:
- `NSLocationWhenInUseUsageDescription` - Foreground location access
- `NSLocationAlwaysAndWhenInUseUsageDescription` - Background location access
- `NSBluetoothAlwaysUsageDescription` - Bluetooth access
- `UIBackgroundModes` - Location and Bluetooth updates in background

### Android Permissions

Android permissions are requested at runtime for:
- Fine and coarse location
- Bluetooth scanning and connecting (Android 12+)
- Background location (Android 10+)

## Project Structure

```
├── app/                          # Expo Router entry point
│   └── index.tsx                # Root page
├── components/
│   └── App.tsx                  # Main application component
├── config/
│   ├── crowdconnected.ts        # SDK configuration (create from example)
│   └── crowdconnected.example.ts# Configuration template
├── assets/                       # Images, icons, splash screens
├── ios/                         # Native iOS code (generated)
├── android/                     # Native Android code (generated)
├── app.json                     # Expo configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## Usage

### Basic Flow

1. **Grant Permissions** - Click "Perms" to request location permissions
2. **Optional: Background Permission** - Click "BG" for background location access
3. **Initialize SDK** - Click "Init" to initialize the location provider
4. **Start Tracking** - Click "Start" to begin real-time location updates
5. **View Location** - Location data displays at the bottom of the screen

### Floor Plan Navigation

- Enter a floor plan key in the textbox (e.g., "demo", "cloudnext25")
- Click "OK" to load that floor plan
- Use map controls:
  - **+** - Zoom in
  - **-** - Zoom out
  - **⤢** - Fit to bounds

### Background Mode

Toggle "BG" switch to enable/disable background location updates before initializing the SDK. Note: This cannot be changed after initialization.

## Features

### Map Integration
- Dual map instances for demonstrating different configurations
- Interactive booth selection
- Zoom and pan controls
- Fit-to-bounds functionality

### Location Tracking
- Real-time location updates via CrowdConnected
- Toggle background mode tracking
- Location display with latitude/longitude coordinates
- Bluetooth scanning for improved accuracy

### Permission Handling
- Platform-aware permission requests (Android/iOS)
- Version-specific requirements (Bluetooth on Android 12+)
- Visual status indicators for permissions, SDK, and tracking states

### Developer Experience
- TypeScript support with strict mode
- Consistent styling with React Native StyleSheet
- Comprehensive logging for debugging
- ESLint configuration for code quality

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.1.0 | UI library |
| React Native | 0.81.4 | Cross-platform framework |
| Expo | 54.0.12 | Development platform |
| Expo Router | 6.0.10 | Navigation |
| TypeScript | 5.9.2 | Type safety |
| React Native Reanimated | 4.1.1 | Animations |

## Troubleshooting

### iOS Build Issues

**Error: Info.plist missing location permissions**
- Ensure `app.json` has the proper `infoPlist` configuration
- Run `npm run prebuild` to regenerate native code

**Error: Bluetooth permission required**
- Add `NSBluetoothAlwaysUsageDescription` to `app.json`
- Rebuild with `npm run prebuild`

### Android Build Issues

**Error: Gradle build failure**
- Clear cache: `npm run prebuild`
- Ensure Android SDK is properly installed
- Check Android Studio SDK Manager for required API levels

### Runtime Issues

**Location not updating**
- Verify permissions are granted
- Check SDK is initialized (Init button shows success)
- Ensure location services are enabled on device

**SDK initialization fails**
- Verify CrowdConnected credentials in `config/crowdconnected.ts`
- Check device has internet connectivity
- Review console logs for detailed error messages

## Contributing

We welcome contributions! Please feel free to submit pull requests with improvements.

## Resources

- [ExpoFP SDK Documentation](https://www.npmjs.com/package/@expofp/react-native-efp-sdk)
- [CrowdConnected SDK Documentation](https://www.npmjs.com/package/@expofp/react-native-efp-crowdconnected)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)

## License

This example is provided as-is for educational and development purposes.

## Support

For issues related to:
- **ExpoFP SDK** - Visit the [NPM package page](https://www.npmjs.com/package/@expofp/react-native-efp-sdk)
- **This Example** - Open an issue on GitHub
- **CrowdConnected** - Check the [SDK documentation](https://www.npmjs.com/package/@expofp/react-native-efp-crowdconnected)

---

Built with ❤️ using Expo and React Native
