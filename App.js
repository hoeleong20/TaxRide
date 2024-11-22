import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Dimensions,
  Text,
} from "react-native";
import WelcomeScreen from "./app/(tabs)/screens/WelcomeScreen";
import LoginScreen from "./app/(tabs)/screens/LoginScreen";
import SignUpScreen from "./app/(tabs)/screens/SignUpScreen";
import ForgotPasswordScreen from "./app/(tabs)/screens/ForgotPasswordScreen";
import HomeScreen from "./app/(tabs)/screens/HomeScreen";
import RecentFilesScreen from "./app/(tabs)/screens/RecentFilesScreen";
import FilesScreen from "./app/(tabs)/screens/FilesScreen";
import FilesYScreen from "./app/(tabs)/screens/FilesYScreen";
import FilesYCScreen from "./app/(tabs)/screens/FilesYCScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      </NavigationContainer> */}
      <WelcomeScreen />
      // {/* <LoginScreen /> */}
      // {/* <SignUpScreen /> */}
      // {/* <ForgotPasswordScreen /> */}
      // {/* <HomeScreen /> */}
      // {/* <RecentFilesScreen /> */}
      // {/* <FilesScreen /> */}
      // {/* <FilesYScreen /> */}
      // {/* <FilesYCScreen /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
    marginTop: Platform.OS === "android" ? hp(3) : 0,
  },
  marginTopStyle: {
    marginTop: Platform.OS === "android" ? 25 : 0,
  },
});
