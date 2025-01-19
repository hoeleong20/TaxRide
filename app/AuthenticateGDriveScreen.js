import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonC from "../components/ButtonC";
import BackButtonC from "../components/BackButtonC";
import { FilesContext } from "./FilesContext";
import { BASE_URL } from "@env";
import { LoginContext } from "./LoginContext";

const gdriveLogo = require("../assets/gdrive.png");

export default function AuthenticateGDriveScreen() {
  const { refreshFiles } = useContext(FilesContext); // Access `refreshFiles`
  const { loggedInEmail } = useContext(LoginContext);

  const handleGDriveConnection = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/gdrive/authenticate?email=${loggedInEmail}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 202) {
        Alert.alert(
          "Authorization",
          "Please complete authorization in the browser."
        );

        // Poll for status
        const pollStatus = setInterval(async () => {
          const statusResponse = await fetch(
            `${BASE_URL}/gdrive/status?email=${loggedInEmail}`
          );
          const statusData = await statusResponse.json();

          if (statusData.isAuthenticated) {
            clearInterval(pollStatus); // Stop polling
            Alert.alert("Success", "Google Drive connected successfully!");
            await refreshFiles(); // Refresh files after successful authentication
            router.push("/HomeScreen"); // Redirect to the home screen
          }
        }, 5000); // Poll every 5 seconds
      } else if (response.ok) {
        Alert.alert("Success", "Google Drive connected successfully!");
        await refreshFiles(); // Refresh files after successful connection
        router.push("/HomeScreen"); //SignUpScreen
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.message ||
            "Failed to connect to Google Drive. Please try again."
        );
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
        <Text style={styles.titleText}>Connect to Google Drive</Text>
        <Text style={styles.descText}>
          Click the button below to connect your Google Drive account.
        </Text>
        <ButtonC
          textContent="Connect Google Drive"
          buttonStyle={styles.connectButton}
          textStyle={styles.connectText}
          onPress={handleGDriveConnection}
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
  connectButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginBottom: hp(2),
  },
  connectText: {
    color: "white",
  },
});
