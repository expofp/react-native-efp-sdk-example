import { ExpoFpSdk } from "@expofp/expofp-sdk-rn";
import { Button, ScrollView, StyleSheet, View } from "react-native";

export default function Overlay() {
  const buttons = [
    { title: "Zoom In", onPress: ExpoFpSdk.zoomIn },
    { title: "Zoom Out", onPress: ExpoFpSdk.zoomOut },
  ].map((item, i) => (
    <Button key={i} title={item.title} onPress={item.onPress} />
  ));

  return (
    <ScrollView style={styles.overlay}>
      <View style={styles.content}>{buttons}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 999,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: "30%",
  },
  content: {
    padding: 30,
    gap: 10,
  },
});
