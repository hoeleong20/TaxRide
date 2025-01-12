import { Tabs } from "expo-router";
import TabBarC from "../../components/TabBarC";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function TabsLayout() {
  return (
    <ActionSheetProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "blue",
            headerShown: false,
          }}
          tabBar={(props) => <TabBarC {...props} />}
        >
          <Tabs.Screen
            name="HomeScreen"
            options={{
              title: "Home",
            }}
          />
          <Tabs.Screen
            name="AddScreen"
            options={{
              title: "",
            }}
          />
          <Tabs.Screen
            name="FilesScreen"
            options={{
              title: "Files",
            }}
            // listeners={{
            //   tabPress: (e) => {
            //     // Prevent default action
            //     e.preventDefault();
            //     // handleCameraPermission();
            //     handleGalleryPermission();
            //   },
            // }}
          />
        </Tabs>
    </ActionSheetProvider>
  );
}
