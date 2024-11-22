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
import FileC from "../components/FileC";
import FileScreenTitleC from "../components/FileScreenTitleC";
import FolderC from "../components/FolderC";

const logoImg = require("../assets/adaptive-icon.png");

export default function FilesYScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <FileScreenTitleC screenTitleText={"Lifestyle"} />
      <View>
        <FileC fileName={"Invoice"} fileDate={"25 Oct 2023"} fileSize={2.4} />
        <FileC fileName={"Invoice"} fileDate={"25 Oct 2023"} fileSize={2.4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: hp(2),
  },
  screenTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3),
  },
  screenTitleText: {
    fontSize: wp(6),
    marginLeft: wp(4),
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
