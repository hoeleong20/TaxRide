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
} from "react-native";
import { useState, useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonC from "../components/ButtonC";
import TextInputC from "../components/TextInputC";
import BackButtonC from "../components/BackButtonC";
import { Link, router } from "expo-router";
import { LoginContext } from "./LoginContext";

import { BASE_URL } from "@env";

const logoImg = require("../assets/taxride_logo.png");

export default function LoginScreen() {
  const { setIsLoggedIn } = useContext(LoginContext);
  const { setLoggedInEmail } = useContext(LoginContext);

  const [email, setEmail] = useState("hoeleongjob01@gmail.com");
  const [password, setPassword] = useState("Pass123.");
  const [passwordVisible, setPasswordVisible] = useState(false);
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
        setIsLoggedIn(true);
        setLoggedInEmail(email);
        router.push("/AuthenticateGDriveScreen");
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (error) {
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
            <Text style={styles.titleText}>Welcome Back</Text>

            {/* Email Field */}
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
            <TextInputC
              placeholderText={"Enter your password"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible} // Handle password masking
              includeEyeIcon={true} // Include eye icon to toggle masking
            />
            <Link href="/ForgotPasswordScreen" style={styles.fpText}>
              <Text>Forgot Password?</Text>
            </Link>
            <ButtonC
              textContent="Login"
              buttonStyle={styles.loginButton}
              textStyle={styles.loginText}
              onPress={handleLogin}
            />
            <View style={styles.altContainer}>
              <Text style={styles.altText1}>Don't have an account?</Text>
              <Link href="/SignUpScreen">
                <Text style={styles.altText2}>Sign Up</Text>
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
  scrollContainer: { paddingHorizontal: wp(7), paddingTop: hp(2) },
  logoContainer: { alignItems: "center" },
  logoImgStyle: { width: hp(20), height: hp(20), margin: hp(2) },
  titleText: {
    fontSize: hp(3),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: hp(3),
  },
  fpText: { textAlign: "right", marginBottom: hp(5) },
  loginButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginBottom: hp(2),
  },
  loginText: { color: "white" },
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
