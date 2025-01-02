import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonC from "../components/ButtonC";
import TextInputC from "../components/TextInputC";
import BackButtonC from "../components/BackButtonC";
import { Link } from "expo-router";

const logoImg = require("../assets/taxride_logo.png");
import { BASE_URL } from "@env";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");

  const handleSignUp = async () => {
    if (password !== cfmPassword) {
      Alert.alert("Error", "Passwords do not match");
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
        Alert.alert("Success", "Account created successfully!");
      } else {
        Alert.alert("Error", data.message || "Signup failed");
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
            <Text style={styles.titleText}>Create Account</Text>
            <TextInputC
              placeholderText={"Name"}
              value={name}
              onChangeText={setName}
            />
            <TextInputC
              placeholderText={"Email"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInputC
              placeholderText={"Password"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              includeEyeIcon={true}
            />
            <TextInputC
              placeholderText={"Confirm password"}
              value={cfmPassword}
              onChangeText={setCfmPassword}
              secureTextEntry={true}
              includeEyeIcon={true}
            />
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
  logoImgStyle: { width: hp(20), height: hp(20), margin: hp(2) },
  titleText: {
    fontSize: hp(3),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: hp(3),
  },
  signUpButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginVertical: hp(3),
  },
  signUpText: { color: "white" },
  altContainer: { flexDirection: "row", marginHorizontal: "auto" },
  altText1: { marginRight: wp(2) },
  altText2: { color: "#3E33D9", fontWeight: "600" },
});
