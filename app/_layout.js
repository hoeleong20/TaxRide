import { Stack } from "expo-router";
import { FilesProvider } from "../app/FilesContext";
import { LoginProvider, LoginContext } from "./LoginContext";

export default function Layout() {
  return (
    <LoginProvider>
      <LoginContext.Consumer>
        {({ isLoggedIn }) =>
          isLoggedIn ? (
            <FilesProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </FilesProvider>
          ) : (
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          )
        }
      </LoginContext.Consumer>
    </LoginProvider>
    // <LoginProvider>
    //   <LoginContext.Consumer>
    //     {({ isLoggedIn }) =>
    //       isLoggedIn ? (
    //         <FilesProvider>
    //           <Stack
    //             screenOptions={{
    //               headerShown: false,
    //             }}
    //           />
    //         </FilesProvider>
    //       ) : (
    //         <Stack
    //           screenOptions={{
    //             headerShown: false,
    //           }}
    //         />
    //       )
    //     }
    //   </LoginContext.Consumer>
    // </LoginProvider>
    //-----------------------------------------------------------
    // <FilesProvider>
    //   <Stack
    //     screenOptions={{
    //       headerShown: false,
    //     }}
    //   />
    // </FilesProvider>
  );
}
