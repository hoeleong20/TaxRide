import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useContext, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Link } from "expo-router";
import ButtonC from "../components/ButtonC";

const logoImg = require("../assets/adaptive-icon.png");

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#61dafb" />
      <View style={styles.topContainer}></View>
      <View style={styles.bottomContainer}>
        <View style={styles.logoContainer}>
          <Image source={logoImg} style={styles.logoImgStyle} />
          <Text style={styles.logoText}>TaxRide</Text>
        </View>
        {/* <ButtonC
            textContent="Login"
            buttonStyle={styles.loginButton}
            textStyle={styles.loginText}
          /> */}
        {/* <Link href="/LoginScreen" asChild> */}
        <ButtonC
          textContent="Login"
          buttonStyle={styles.loginButton}
          textStyle={styles.loginText}
          navigateToPath="/LoginScreen"
        />
        {/* <Pressable style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable> */}
        {/* </Link> */}
        <ButtonC
          textContent="Sign Up"
          buttonStyle={styles.signUpButton}
          textStyle={styles.SignUpText}
          navigateToPath="/SignUpScreen"
        />

        {/* <View style={[styles.button, styles.loginButton]}>
          <Text style={[styles.text, styles.loginText]}>Login</Text>
        </View>
        <View style={[styles.button, styles.signUpButton]}>
          <Text style={[styles.text, styles.SignUpText]}>Sign Up</Text>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: StatusBar.currentHeight,
  },
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
  linkStyle: {
    backgroundColor: "red",
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
