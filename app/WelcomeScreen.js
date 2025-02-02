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
  ImageBackground,
} from "react-native";
import { useContext, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Link, router } from "expo-router";
import ButtonC from "../components/ButtonC";

const logoImg = require("../assets/taxride_logo.png");
const image = require("../assets/welcomeScreen.png");

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      {/* <View style={styles.topContainer}></View>
       */}
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={{ width: wp(100), height: hp(45) }}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.logoContainer}>
          <Image source={logoImg} style={styles.logoImgStyle} />
          <Text style={styles.logoText}>TaxRide</Text>
        </View>
        {/* <Link href="/LoginScreen" asChild> */}
        <ButtonC
          textContent="Login"
          buttonStyle={styles.loginButton}
          textStyle={styles.loginText}
          onPress={() => router.push("/LoginScreen")}
        />
        {/* <Pressable style={styles.loginButton}>
              <Text style={styles.loginText}>Login</Text>
            </Pressable> */}
        {/* </Link> */}
        <ButtonC
          textContent="Sign Up"
          buttonStyle={styles.signUpButton}
          textStyle={styles.SignUpText}
          onPress={() => router.push("/SignUpScreen")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: StatusBar.currentHeight,
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
