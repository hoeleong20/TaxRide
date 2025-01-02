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
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonC from "../components/ButtonC";
import TextInputC from "../components/TextInputC";
import BackButtonC from "../components/BackButtonC";

const logoImg = require("../assets/adaptive-icon.png");
import { BASE_URL } from "@env";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("chewhl2002@gmail.com");

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message || "Password reset email sent.");
      } else {
        Alert.alert("Error", data.message || "Failed to send reset email.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <BackButtonC border={true} />
          <View style={styles.logoContainer}>
            <Image source={logoImg} style={styles.logoImgStyle} />
          </View>
          <Text style={styles.titleText}>Restore Password</Text>
          <TextInputC
            placeholderText={"Enter your email"}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.descText}>
            You will receive an email with a password reset link.
          </Text>
          <ButtonC
            textContent="Send Email"
            buttonStyle={styles.loginButton}
            textStyle={styles.loginText}
            onPress={handleForgotPassword}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  logoImgStyle: {
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
});
