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
import { router } from "expo-router";

const logoImg = require("../assets/taxride_logo.png");
import { BASE_URL } from "@env";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [tooltip, setTooltip] = useState({}); // Object to store validation messages

  const validateField = (fieldName, value) => {
    const newTooltip = { ...tooltip };

    if (fieldName === "email") {
      if (!/\S+@\S+\.\S+/.test(value)) {
        newTooltip.email = "Please enter a valid email address";
      } else {
        newTooltip.email = null;
      }
    }

    setTooltip(newTooltip);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    validateField("email", email);

    if (tooltip.email) {
      Alert.alert("Error", "The email is invalid.");
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
        Alert.alert("Success", data.message || "Password reset email sent.", [
          { text: "OK", onPress: () => router.push("/LoginScreen") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to send reset email.");
      }
    } catch (error) {
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
          <View style={styles.inputContainer}>
            <TextInputC
              placeholderText={"Enter your email"}
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateField("email", email)}
              keyboardType="email-address" // Explicitly set keyboard type
            />
            {tooltip.email && (
              <Text style={styles.tooltip}>{tooltip.email}</Text>
            )}
          </View>
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
