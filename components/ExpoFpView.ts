import { EXPOFP_VIEW_ID, type ExpoFpViewParams } from "@expofp/expofp-sdk-rn";
import { requireNativeComponent } from "react-native";

const ExpoFpView = requireNativeComponent<ExpoFpViewParams>(EXPOFP_VIEW_ID);

export default ExpoFpView;
