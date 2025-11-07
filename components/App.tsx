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
    <View style={styles.view}>
      <View style={{ marginTop: 50 }}>
        <Text style={styles.statusText}>
          Permissions: {permissionsGranted ? "✅ Granted" : "❌ Not granted"}
        </Text>
        <Text style={styles.statusText}>
          SDK: {isInitialized ? "✅ Initialized" : "❌ Not initialized"}
        </Text>
        <Text style={styles.statusText}>
          Tracking: {isTracking ? "🟢 Active" : "⚪ Inactive"}
        </Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>
            Background Updates: {backgroundModeEnabled ? "ON" : "OFF"}
          </Text>
          <Switch
            value={backgroundModeEnabled}
            onValueChange={setBackgroundModeEnabled}
            disabled={isInitialized}
          />
        </View>
        <View style={{ height: 10 }} />
        <Button
          title="1. Request Permissions"
          onPress={requestPermissions}
          disabled={permissionsGranted}
        />
        <Button
          title="2. Request Background Permission"
          onPress={requestBackgroundPermission}
          disabled={!permissionsGranted}
        />
        <View style={{ height: 20 }} />
        <Button
          title="3. Init SDK"
          onPress={doInit}
          disabled={!permissionsGranted || isInitialized}
        />
        <Button
          title="4. Start Tracking"
          onPress={doStart}
          disabled={!isInitialized || isTracking}
        />
        <Button title="Stop Tracking" onPress={doStop} disabled={!isTracking} />
        <View style={{ height: 20 }} />
        <Button
          title="🔄 Reset (to test different mode)"
          onPress={doReset}
          disabled={isTracking}
          color="#FF6B6B"
        />
      </View>
      <View style={styles.locationContainer}>
        <Text style={styles.locationTitle}>Latest location</Text>
        <Text style={styles.locationValue}>
          {location ? JSON.stringify(location, null, 2) : "No updates yet"}
        </Text>
      </View>

      <ExpofpView
        ref={apiRef}
        style={styles.view}
        locationProvider={CrowdConnectedLocationProvider}
        expoKey={expoKey}
        onBoothClick={(e: any) => {
          console.log("MAP 1: Booth clicked:", e);
        }}
      />

      <ExpofpView expoKey="demo" onBoothClick={(e: any) => {
        console.log("MAP 2: Booth clicked:", e);
      }} />

      <View style={styles.buttons}>
        <Button title="Next" onPress={switchKey} />
        <Button
          title="+"
          onPress={() => {
            console.log(
              "🔶 [App] + button pressed, apiRef.current:",
              apiRef.current,
            );
            apiRef.current?.zoomIn();
          }}
        />
        <Button
          title="-"
          onPress={() => {
            console.log(
              "🔶 [App] - button pressed, apiRef.current:",
              apiRef.current,
            );
            apiRef.current?.zoomOut();
          }}
        />
        <Button
          title="Fit Bounds"
          onPress={() => {
            console.log(
              "🔶 [App] Fit Bounds button pressed, apiRef.current:",
              apiRef.current,
            );
            apiRef.current?.fitBounds();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  buttons: {
    position: "absolute",
    zIndex: 999,
    top: 100,
    left: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  locationContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationTitle: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 18,
    color: "#333",
  },
  locationValue: {
    fontFamily: "Courier",
    fontSize: 12,
    color: "#666",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
