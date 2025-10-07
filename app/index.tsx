import {
  EXPOFP_VIEW_ID,
  ExpoFpSdk,
  type ExpoFpViewParams,
} from "@expofp/expofp-sdk-rn";
import {
  Button,
  requireNativeComponent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ExpoFpView = requireNativeComponent<ExpoFpViewParams>(EXPOFP_VIEW_ID);

export default function Index() {
  const buttons = [
    { title: "Zoom In", onPress: ExpoFpSdk?.zoomIn },
    { title: "Zoom Out", onPress: ExpoFpSdk?.zoomOut },
  ].map((item, i) => (
    <Button key={i} title={item.title} onPress={item.onPress} />
  ));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.view}>
        <ExpoFpView style={styles.view} url="https://demo.expofp.com/" />

        <ScrollView style={styles.overlay}>
          <View style={styles.content}>{buttons}</View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#ebebeb",
  },
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
