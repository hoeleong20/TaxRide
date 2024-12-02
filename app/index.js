import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import WelcomeScreen from "./WelcomeScreen";
import React from "react";
import FilesYScreen from "./(tabs)/FilesScreen/FilesYScreen";

export default function App() {
  return (
    <React.StrictMode>
      <ActionSheetProvider>
        <WelcomeScreen />
      </ActionSheetProvider>
    </React.StrictMode>
  );
}
