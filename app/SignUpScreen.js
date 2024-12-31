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
import { Link } from "expo-router";

const logoImg = require("../assets/taxride_logo.png");
// const BASE_URL = "http://192.168.1.39:3000";
import { BASE_URL } from "@env";


export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");

  const handleSignUp = async () => {
    // try {
    //   console.log("Sending request...");
    //   const response = await fetch(`${BASE_URL}/signup`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ name, email, password }),
    //   });
    //   console.log("Request sent, awaiting response...");
    //   console.log("3"); // Log added here for more visibility
    // } catch (error) {
    //   console.log("Error occurred in fetch", error);
    // }

    console.log("1");
    if (password !== cfmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    console.log("2");

    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      console.log("3");
      // console.log("Response:", response); // Log the response object
      // console.log("Status Code:", response.status); // Log status code
      // console.log("Response Text:", await response.text()); // Log raw response text

      // try {
      //   const data = await response.json();
      //   console.log("Parsed Data:", data);
      // } catch (parseError) {
      //   console.error("Error parsing JSON:", parseError);
      // }
      const rawResponse = await response.text(); // Read response as text
      console.log("Raw Response:", rawResponse);

      // Attempt to parse JSON if applicable
      let data;
      try {
        data = JSON.parse(rawResponse); // Parse raw text as JSON
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        Alert.alert("Error", "Unexpected response from server.");
        return;
      }

      // Check for success or error in response
      if (response.ok) {
        console.log("4 - Request was successful!");
        Alert.alert("Success", "Account created successfully!");
      } else {
        console.log("5 - Request failed.");
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error in fetch:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      console.log("6 - Finished execution of handleSignUp.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        onPress={handleSignUp}
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
