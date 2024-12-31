import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonC from "../components/ButtonC";
import TextInputC from "../components/TextInputC";
import BackButtonC from "../components/BackButtonC";
import { Link, router } from "expo-router";

import { BASE_URL } from "@env";

// const BASE_URL = "http://192.168.1.28:3000"; //http://localhost:3000

const logoImg = require("../assets/taxride_logo.png");

export default function LoginScreen() {
  const [email, setEmail] = useState("hoeleongjob01@gmail.com");
  const [password, setPassword] = useState("pass1234.");

  const handleLogin = async () => {
    console.log("1");

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("2");

      const rawResponse = await response.text();
      console.log("Raw Response:", rawResponse);

      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        Alert.alert("Error", "Unexpected response from server.");
        return;
      }

      if (response.ok) {
        console.log("3 - Login successful");
        Alert.alert("Success", "Login successful!");
        router.push("/HomeScreen");
      } else {
        console.log("4 - Login failed");
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error in fetch:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      console.log("5 - Finished execution of handleLogin.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButtonC border={true} />
      <View style={styles.logoContainer}>
        <Image source={logoImg} style={styles.logoImgStyle} />
      </View>
      <Text style={styles.titleText}>Welcome Back</Text>
      <TextInputC
        placeholderText={"Enter your email"}
        value={email}
        onChangeText={setEmail}
      />
      <TextInputC
        placeholderText={"Enter your password"}
        value={password}
        onChangeText={setPassword}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(7),
    paddingTop: StatusBar.currentHeight,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoImgStyle: {
    width: hp(20),
    height: hp(20),
    margin: hp(2),
  },
  titleText: {
    fontSize: hp(3),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: hp(3),
  },
  fpText: {
    textAlign: "right",
    marginBottom: hp(5),
  },
  loginButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginBottom: hp(2),
  },
  loginText: {
    color: "white",
  },
  altContainer: {
    flexDirection: "row",
    marginHorizontal: "auto",
  },
  altText1: {
    marginRight: wp(2),
  },
  altText2: {
    color: "#3E33D9",
    fontWeight: "600",
  },
});
