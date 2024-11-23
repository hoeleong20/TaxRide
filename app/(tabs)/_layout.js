import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Ionicons";
import TabBarC from "../../components/TabBarC";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function TabsLayout() {
  return (
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
        listeners={{
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            alert("Action");
          },
        }}
        // name="AddScreen"
        // options={{
        //   title: "",
        //   presentation: "transparentModal",
        //   animation: "fade",
        //   headerShown: false,
        // }}
      />
      <Tabs.Screen
        name="FilesScreen"
        options={{
          title: "Files",
        }}
      />
    </Tabs>
  );
}
