import { Stack } from "expo-router";
import { FilesProvider } from "../app/FilesContext";

export default function Layout() {
  return (
    <FilesProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </FilesProvider>
  );
}
