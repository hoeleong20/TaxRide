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
import { BASE_URL } from "@env";

export default function SignUpScreen() {
  const [name, setName] = useState("Chew Hoe Leong");
  const [email, setEmail] = useState("hoeleongjob01@gmail.com");
  const [password, setPassword] = useState("Pass123.");
  const [cfmPassword, setCfmPassword] = useState("Pass123.");
  const [tooltip, setTooltip] = useState({}); // Object to store validation messages

  const validateField = (fieldName, value) => {
    const newTooltip = { ...tooltip };

    if (fieldName === "name") {
      if (value.length < 3) {
        newTooltip.name = "Name must be at least 3 characters";
      } else {
        newTooltip.name = null;
      }
    }

    if (fieldName === "email") {
      if (!/\S+@\S+\.\S+/.test(value)) {
        newTooltip.email = "Please enter a valid email address";
      } else {
        newTooltip.email = null;
      }
    }

    if (fieldName === "password") {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,}$/;
      if (!passwordPattern.test(value)) {
        newTooltip.password =
          "Password must include uppercase, lowercase, number, special character, and be at least 8 characters";
      } else {
        newTooltip.password = null;
      }
    }

    if (fieldName === "cfmPassword") {
      if (value !== password) {
        newTooltip.cfmPassword = "Passwords do not match";
      } else {
        newTooltip.cfmPassword = null;
      }
    }

    setTooltip(newTooltip);
  };

  const handleSignUp = async () => {
    validateField("name", name);
    validateField("email", email);
    validateField("password", password);
    validateField("cfmPassword", cfmPassword);

    if (
      tooltip.name ||tooltip.email || tooltip.password || tooltip.cfmPassword
    ) {
      Alert.alert(
        "Error","There exist invalid input field."
      );
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/RegisterSuccessScreen");
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <BackButtonC border={true} />
            <View style={styles.logoContainer}>
              <Image source={logoImg} style={styles.logoImgStyle} />
            </View>
            <Text style={styles.titleText}>Create Account</Text>
            {/* Name Field */}
            <View style={styles.inputContainer}>
              <TextInputC
                placeholderText="Name"
                value={name}
                onChangeText={setName}
                onBlur={() => validateField("name", name)}
              />
              {tooltip.name && (
                <Text style={styles.tooltip}>{tooltip.name}</Text>
              )}
            </View>
            {/* Email Field */}
            <View style={styles.inputContainer}>
              <TextInputC
                placeholderText="Email"
                value={email}
                onChangeText={setEmail}
                onBlur={() => validateField("email", email)}
                keyboardType="email-address"
              />
              {tooltip.email && (
                <Text style={styles.tooltip}>{tooltip.email}</Text>
              )}
            </View>
            {/* Password Field */}
            <View style={styles.inputContainer}>
              <TextInputC
                placeholderText="Password"
                value={password}
                onChangeText={setPassword}
                onBlur={() => validateField("password", password)}
                secureTextEntry={true}
                includeEyeIcon={true}
              />
              {tooltip.password && (
                <Text style={styles.tooltip}>{tooltip.password}</Text>
              )}
            </View>
            {/* Confirm Password Field */}
            <View style={styles.inputContainer}>
              <TextInputC
                placeholderText="Confirm Password"
                value={cfmPassword}
                onChangeText={setCfmPassword}
                onBlur={() => validateField("cfmPassword", cfmPassword)}
                secureTextEntry={true}
                includeEyeIcon={true}
              />
              {tooltip.cfmPassword && (
                <Text style={styles.tooltip}>{tooltip.cfmPassword}</Text>
              )}
            </View>
            <ButtonC
              textContent="Sign Up"
              buttonStyle={styles.signUpButton}
              textStyle={styles.signUpText}
              onPress={handleSignUp}
            />
            <View style={styles.altContainer}>
              <Text style={styles.altText1}>Already have an account?</Text>
              <Link href="/LoginScreen">
                <Text style={styles.altText2}>Login Now</Text>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFBFB" },
  scrollContainer: {
    paddingHorizontal: wp(7),
    paddingTop: StatusBar.currentHeight,
  },
  logoContainer: { alignItems: "center" },
  logoImgStyle: { width: hp(18), height: hp(16), marginBottom: hp(2) },
  titleText: {
    fontSize: hp(3),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: hp(3),
  },
  signUpButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  signUpText: { color: "white" },
  altContainer: { flexDirection: "row", marginHorizontal: "auto" },
  altText1: { marginRight: wp(2) },
  altText2: { color: "#3E33D9", fontWeight: "600" },
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
