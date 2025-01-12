import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonC from "../components/ButtonC";
import BackButtonC from "../components/BackButtonC";

import { BASE_URL } from "@env";

const gdriveLogo = require("../assets/gdrive.png");

export default function AuthenticateGDriveScreen() {
  const [email, setEmail] = useState("chewhl2002@gmail.com");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Login successful!");
        router.push("/AuthenticateGDriveScreen");
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <BackButtonC border={true} />
        <View style={styles.logoContainer}>
          <Image source={gdriveLogo} style={styles.gdriveLogoStyle} />
        </View>
        <Text style={styles.titleText}>Welcome Back</Text>

        <ButtonC
          textContent="Login"
          buttonStyle={styles.loginButton}
          textStyle={styles.loginText}
          onPress={handleLogin}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(7),
    paddingTop: hp(2),
  },
  logoContainer: {
    alignItems: "center",
  },
  gdriveLogoStyle: {
    width: hp(30),
    height: hp(30),
    margin: hp(2),
  },
  titleText: {
    fontSize: hp(3),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: hp(3),
  },
  descText: {
    textAlign: "center",
    marginTop: hp(2),
    marginBottom: hp(4),
    color: "#8391A1",
  },
  loginButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginBottom: hp(2),
  },
  loginText: {
    color: "white",
  },
  inputContainer: {
    minHeight: hp(11.5), // Define a fixed height to include both input and tooltip
  },
  tooltip: {
    fontSize: hp(1.5),
    color: "red",
    padding: 0,
    marginBottom: hp(0.5),
  },
});
