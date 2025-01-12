import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import React from "react";
import WelcomeScreen from "./WelcomeScreen";

export default function App() {
  return (
    <React.StrictMode>
      <ActionSheetProvider>
        <WelcomeScreen />
      </ActionSheetProvider>
    </React.StrictMode>
  );
}
