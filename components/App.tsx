import { ExpofpView, type ExpofpViewMethods } from "@expofp/expofp-sdk-rn";
import { useCallback, useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

const FP = ["vlg-routes-01", "demo"];

export default function App() {
  const apiRef = useRef<ExpofpViewMethods>(null);
  const [idx, setIdx] = useState(0);

  const [expoKey, setExpoKey] = useState(FP[idx]);
  const switchKey = useCallback(() => {
    const nextIdx = (idx + 1) % FP.length;
    setIdx(nextIdx);
    setExpoKey(FP[nextIdx]);
  }, [idx]);

  return (
    <View style={styles.view}>
      <ExpofpView
        ref={apiRef}
        style={styles.view}
        url={`https://${expoKey}.expofp.com/`}
        onBoothDidClick={(e: any) => {
          console.log("MAP 1: Booth clicked:", e);
        }}
      />
      <ExpofpView
        expoKey="demo"
        onBoothDidClick={(e: any) => {
          console.log("MAP 2: Booth clicked:", e);
        }}
      />
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
});
