import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
  TextInput,
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

const logoImg = require("../assets/taxride_logo.png");
const BASE_URL = "http://192.168.1.39:3000";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    console.log("1");

    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
        console.log("3 - Password sent");
        Alert.alert("Success", `Your password is: ${data.password}`);
      } else {
        console.log("4 - Email not found");
        Alert.alert("Error", data.message || "Email not found");
      }
    } catch (error) {
      console.error("Error in fetch:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      console.log("5 - Finished execution of handleForgotPassword.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButtonC border={true} />
      <View style={styles.logoContainer}>
        <Image source={logoImg} style={styles.logoImgStyle} />
      </View>
      <Text style={styles.titleText}>Restore Password</Text>
      <TextInputC
        placeholderText={"Enter your email"}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.descText}>
        You will receive email with password reset link
      </Text>
      <ButtonC
        textContent="Send Email"
        buttonStyle={styles.sendEmailButton}
        textStyle={styles.sendEmailText}
        onPress={handleForgotPassword}
      />
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
  sendEmailButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginBottom: hp(2),
  },
  sendEmailText: {
    color: "white",
  },
});
