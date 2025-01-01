import { Stack } from "expo-router";
import { FilesProvider } from "../../FilesContext";

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
