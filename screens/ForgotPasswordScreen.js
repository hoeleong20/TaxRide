import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
  TextInput,
} from "react-native";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonC from "../components/ButtonC";
import TextInputC from "../components/TextInputC";
import BackButtonC from "../components/BackButtonC";

const logoImg = require("../assets/adaptive-icon.png");

export default function ForgotPasswordScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <BackButtonC border={true} />
      <View style={styles.logoContainer}>
        <Image source={logoImg} style={styles.logoImgStyle} />
      </View>
      <Text style={styles.titleText}>Restore Password</Text>
      <TextInputC
        placeholderText={"Enter your email"}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.descText}>
        You will receive email with password reset link
      </Text>
      <ButtonC
        textContent="Send Email"
        buttonStyle={styles.loginButton}
        textStyle={styles.loginText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
