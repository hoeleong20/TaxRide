import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
  Platform,
  Pressable,
} from "react-native";
import { useContext, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonC from "../components/ButtonC";
import { Link } from "expo-router";

const logoImg = require("../assets/adaptive-icon.png");

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}></View>
      <View style={styles.bottomContainer}>
        <View style={styles.logoContainer}>
          <Image source={logoImg} style={styles.logoImgStyle} />
          <Text style={styles.logoText}>TaxRide</Text>
        </View>
        <Link href="../screens/LoginScreen">
          {/* <ButtonC
            textContent="Login"
            buttonStyle={styles.loginButton}
            textStyle={styles.loginText}
            onPress={() => navigation.navigate("Login")}
          /> */}
          <Pressable>
            <Text>Home</Text>
          </Pressable>
        </Link>
        <ButtonC
          textContent="Sign Up"
          buttonStyle={styles.signUpButton}
          textStyle={styles.SignUpText}
        />
        {/* <View style={[styles.button, styles.loginButton]}>
          <Text style={[styles.text, styles.loginText]}>Login</Text>
        </View>
        <View style={[styles.button, styles.signUpButton]}>
          <Text style={[styles.text, styles.SignUpText]}>Sign Up</Text>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  topContainer: {
    height: "45%",
    backgroundColor: "red",
  },
  bottomContainer: {
    height: "55%",
    paddingHorizontal: "6%",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoImgStyle: {
    width: hp(15),
    height: hp(15),
    margin: hp(2),
  },
  logoText: {
    fontSize: hp(3.5),
    fontWeight: "500",
    marginBottom: hp(4),
  },
  button: {
    height: "13%",
    justifyContent: "center",
    borderRadius: hp(1),
    borderWidth: hp(0.2),
  },
  loginButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginBottom: hp(2),
  },
  signUpButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#3E33D9",
  },
  text: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: hp(2.5),
  },
  loginText: {
    color: "white",
  },
  SignUpText: {
    color: "#3E33D9",
  },
});
