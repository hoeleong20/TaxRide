import { Stack } from "expo-router";
import { FilesProvider } from "../app/FilesContext";
import { LoginProvider, LoginContext } from "./LoginContext";

export default function Layout() {
  return (
    <LoginProvider>
      <FilesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </FilesProvider>
    </LoginProvider>
  );
}
