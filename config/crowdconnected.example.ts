/**
 * CrowdConnected SDK Configuration Example
 *
 * To use this example:
 * 1. Copy this file to crowdconnected.ts
 * 2. Replace the placeholder values with your own CrowdConnected credentials
 * 3. For production, consider using environment variables instead
 */

export const CROWDCONNECTED_CONFIG = {
  // Your CrowdConnected app key
  appKey: "YOUR_APP_KEY_HERE",

  // Your CrowdConnected token
  token: "YOUR_TOKEN_HERE",

  // Your CrowdConnected secret
  secret: "YOUR_SECRET_HERE",

  // Navigation type - "all", "IPS", or "GEO"
  navigationType: "all",

  // Enable Bluetooth scanning
  isBluetoothEnabled: true,

  // Enable heading/compass
  isHeadingEnabled: true,
} as const;
