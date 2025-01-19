import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonC from "../components/ButtonC";
import TextInputC from "../components/TextInputC";
import BackButtonC from "../components/BackButtonC";
import { Link, router } from "expo-router";

const logoImg = require("../assets/taxride_logo.png");

export default function RegisterSuccessScreen() {
  const handleGoToLogin = () => {
    router.push("/LoginScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <BackButtonC border={true} />
        <View style={styles.logoContainer}>
          <Image source={logoImg} style={styles.logoImgStyle} />
        </View>
        <Text style={styles.titleText}>Register Successfully</Text>
        <Text style={styles.altText}>
          Please check your email to verify your account.
        </Text>

        <ButtonC
          textContent="Go To Log In"
          buttonStyle={styles.goToLoginButton}
          textStyle={styles.goToLoginText}
          onPress={handleGoToLogin}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },
  scrollContainer: {
    paddingHorizontal: wp(7),
    paddingTop: StatusBar.currentHeight,
  },
  logoContainer: { alignItems: "center" },
  logoImgStyle: { width: hp(30), height: hp(30), margin: hp(2) },
  titleText: {
    fontSize: hp(3),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: hp(3),
  },
  altText: {
    textAlign: "center",
    marginTop: hp(2),
    marginBottom: hp(4),
  },
  goToLoginButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginTop: hp(2),
    marginBottom: hp(3),
  },
  goToLoginText: { color: "white" },
  altContainer: { flexDirection: "row", marginHorizontal: "auto" }, //
  altText1: { marginRight: wp(2) },
});
