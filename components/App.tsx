import { CrowdConnectedLocationProvider } from "@expofp/react-native-efp-crowdconnected";
import { ExpofpView, type ExpofpViewMethods } from "@expofp/react-native-efp-sdk";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";

const FP = ["demo", "cloudnext25"];

export default function App() {
  const apiRef = useRef<ExpofpViewMethods>(null);
  const [idx, setIdx] = useState(0);

  const [expoKey, setExpoKey] = useState(FP[idx]);
  const switchKey = useCallback(() => {
    const nextIdx = (idx + 1) % FP.length;
    setIdx(nextIdx);
    setExpoKey(FP[nextIdx]);
  }, [idx]);

  const [location, setLocation] = useState<any>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [backgroundModeEnabled, setBackgroundModeEnabled] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS !== "android") {
      setPermissionsGranted(true);
      return true;
    }

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];

      // Add Bluetooth permissions based on Android version
      if (Platform.Version >= 31) {
        permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = Object.values(granted).every(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (allGranted) {
        setPermissionsGranted(true);
        Alert.alert("Success", "All permissions granted!");
        return true;
      } else {
        Alert.alert(
          "Error",
          "Some permissions were denied. The app may not work correctly.",
        );
        return false;
      }
    } catch (err) {
      console.error("Permission request error:", err);
      Alert.alert("Error", "Failed to request permissions");
      return false;
    }
  }, []);

  const requestBackgroundPermission = useCallback(async () => {
    if (Platform.OS !== "android" || Platform.Version < 29) {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: "Background Location Permission",
          message:
            "This app needs access to your location in the background for continuous tracking.",
          buttonPositive: "OK",
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Success", "Background location permission granted!");
        return true;
      } else {
        Alert.alert(
          "Warning",
          "Background location permission denied. Background tracking will not work.",
        );
        return false;
      }
    } catch (err) {
      console.error("Background permission request error:", err);
      return false;
    }
  }, []);

  const doInit = useCallback(async () => {
    if (!permissionsGranted) {
      Alert.alert("Error", "Please grant permissions first");
      return;
    }

    console.log(
      `Initializing SDK ${backgroundModeEnabled ? "WITH" : "WITHOUT"} background updates`,
    );

    CrowdConnectedLocationProvider.setup({
      appKey: "889b5c99",
      token: "d501a6fb90874451a2b148054e69476d",
      secret: "nb2t738418366684tB2oO9IELzLfpk3K",
      navigationType: "all",
      isBackgroundUpdateEnabled: backgroundModeEnabled,
      isBluetoothEnabled: true,
      isHeadingEnabled: true,
    })
      .then((result) => {
        console.log("Setup success:", result);
        setIsInitialized(true);
        Alert.alert(
          "Success",
          `SDK initialized successfully!\nMode: ${backgroundModeEnabled ? "WITH" : "WITHOUT"} background updates`,
        );
      })
      .catch((err) => {
        console.error("Setup fail:", err);
        setIsInitialized(false);
        Alert.alert("Error", `Failed to initialize SDK: ${err.message || err}`);
      });
  }, [permissionsGranted, backgroundModeEnabled]);

  const doStart = useCallback(async () => {
    if (!isInitialized) {
      Alert.alert(
        "Error",
        "Please initialize SDK first by pressing 'Init' button",
      );
      return;
    }
    CrowdConnectedLocationProvider.startUpdatingLocation()
      .then((result) => {
        console.log("startUpdatingLocation:", result);
        setIsTracking(true);
        Alert.alert("Success", "Location tracking started!");
      })
      .catch((err) => {
        console.error("startUpdatingLocation fail:", err);
        setIsTracking(false);
        Alert.alert("Error", `Failed to start tracking: ${err.message || err}`);
      });
  }, [isInitialized]);

  const doStop = useCallback(async () => {
    CrowdConnectedLocationProvider.stopUpdatingLocation()
      .then((result) => {
        console.log("stopUpdatingLocation:", result);
        setIsTracking(false);
        Alert.alert("Success", "Location tracking stopped");
      })
      .catch((err) => {
        console.error("stopUpdatingLocation fail:", err);
        Alert.alert("Error", `Failed to stop tracking: ${err.message || err}`);
      });
  }, []);

  const doReset = useCallback(() => {
    setIsInitialized(false);
    setIsTracking(false);
    setLocation(null);
    Alert.alert(
      "Reset",
      "App state reset. You can now change settings and re-initialize.",
    );
  }, []);


  return (
    <View style={styles.container}>
      {/* Header Panel - Map Controls */}
      <View style={styles.headerPanel}>
        <View style={styles.headerButtonRow}>
          <View style={styles.headerButtonWrapper}>
            <Button title="+" onPress={() => apiRef.current?.zoomIn()} />
          </View>
          <View style={styles.headerButtonWrapper}>
            <Button title="-" onPress={() => apiRef.current?.zoomOut()} />
          </View>
          <View style={styles.headerButtonWrapper}>
            <Button title="⤢" onPress={() => apiRef.current?.fitBounds()} />
          </View>
          <View style={styles.headerButtonWrapper}>
            <Button title="Next" onPress={switchKey} />
          </View>
        </View>
      </View>

      {/* Maps Section */}
      <View style={styles.mapsContainer}>
        <ExpofpView
          ref={apiRef}
          style={styles.map}
          locationProvider={CrowdConnectedLocationProvider}
          expoKey={expoKey}
          onBoothClick={(e: any) => {
            console.log("MAP 1: Booth clicked:", e);
          }}
        />

        <ExpofpView
          style={styles.map}
          expoKey="demo"
          onBoothClick={(e: any) => {
            console.log("MAP 2: Booth clicked:", e);
          }}
        />
      </View>

      {/* Controls Section - Compact */}
      <View style={styles.controlsPanel}>
        {/* Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusSmallText}>
            {permissionsGranted ? "✅" : "❌"} Perms
          </Text>
          <Text style={styles.statusSmallText}>
            {isInitialized ? "✅" : "❌"} SDK
          </Text>
          <Text style={styles.statusSmallText}>
            {isTracking ? "🟢" : "⚪"} Track
          </Text>
          <View style={styles.backgroundToggle}>
            <Text style={styles.toggleLabel}>BG:</Text>
            <Switch
              style={styles.switchSmall}
              value={backgroundModeEnabled}
              onValueChange={setBackgroundModeEnabled}
              disabled={isInitialized}
            />
          </View>
        </View>

        {/* Action Buttons - All on one row */}
        <View style={styles.buttonRow}>
          <View style={styles.tinyButtonWrapper}>
            <Button
              title="Perms"
              onPress={requestPermissions}
              disabled={permissionsGranted}
            />
          </View>
          <View style={styles.tinyButtonWrapper}>
            <Button
              title="BG"
              onPress={requestBackgroundPermission}
              disabled={!permissionsGranted}
            />
          </View>
          <View style={styles.tinyButtonWrapper}>
            <Button
              title="Init"
              onPress={doInit}
              disabled={!permissionsGranted || isInitialized}
            />
          </View>
          <View style={styles.tinyButtonWrapper}>
            <Button
              title="Start"
              onPress={doStart}
              disabled={!isInitialized || isTracking}
            />
          </View>
          <View style={styles.tinyButtonWrapper}>
            <Button
              title="Stop"
              onPress={doStop}
              disabled={!isTracking}
            />
          </View>
          <View style={styles.tinyButtonWrapper}>
            <Button
              title="Reset"
              onPress={doReset}
              disabled={isTracking}
              color="#FF6B6B"
            />
          </View>
        </View>

        {/* Location Info - Compact */}
        {location && (
          <Text style={styles.locationSmall} numberOfLines={1}>
            Lat: {location.latitude?.toFixed(4)} Lng: {location.longitude?.toFixed(4)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  headerPanel: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerButtonRow: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "flex-start",
  },
  headerButtonWrapper: {
    minWidth: 50,
  },
  mapsContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  controlsPanel: {
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
    justifyContent: "flex-start",
  },
  statusSmallText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#333",
  },
  backgroundToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginLeft: "auto",
  },
  toggleLabel: {
    fontSize: 9,
    fontWeight: "500",
    color: "#333",
  },
  switchSmall: {
    transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],
  },
  buttonRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 2,
    justifyContent: "space-between",
  },
  tinyButtonWrapper: {
    flex: 1,
    minHeight: 28,
  },
  locationSmall: {
    fontSize: 9,
    color: "#666",
    fontFamily: "Courier",
    marginTop: 2,
  },
  view: {
    flex: 1,
  },
});
