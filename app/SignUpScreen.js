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

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar/>
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
      />
      <TextInputC
        placeholderText={"Password"}
        value={password}
        onChangeText={setPassword}
      />
      <TextInputC
        placeholderText={"Confirm password"}
        value={cfmPassword}
        onChangeText={setCfmPassword}
      />
      <ButtonC
        textContent="Sign Up"
        buttonStyle={styles.signUpButton}
        textStyle={styles.signUpText}
      />
      <View style={styles.altContainer}>
        <Text style={styles.altText1}>Already have an account?</Text>
        <Link href="/LoginScreen">
          <Text style={styles.altText2}>Login Now</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: StatusBar.currentHeight,
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
  signUpButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginVertical: hp(3),
  },
  signUpText: {
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
