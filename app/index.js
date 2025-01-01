import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import WelcomeScreen from "./WelcomeScreen";
import React from "react";

export default function App() {
  return (
    <React.StrictMode>
      <ActionSheetProvider>
        <WelcomeScreen />
      </ActionSheetProvider>
    </React.StrictMode>
  );
}
