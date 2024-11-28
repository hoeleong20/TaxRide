import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
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

const logoImg = require("../assets/adaptive-icon.png");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <BackButtonC border={true} />
      <View style={styles.logoContainer}>
        <Image source={logoImg} style={styles.logoImgStyle} />
      </View>
      <Text style={styles.titleText}>Welcome Back</Text>
      <TextInputC
        placeholderText={"Enter your email"}
        value={username}
        onChangeText={setUsername}
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
        navigateToPath="/HomeScreen"
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
    // paddingTop: StatusBar.currentHeight,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoImgStyle: {
    width: hp(30),
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
