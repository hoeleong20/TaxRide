import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
  TextInput,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useState } from "react";
import { StatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FolderC from "../../components/FolderC";

const logoImg = require("../../assets/adaptive-icon.png");

export default function FilesScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.screenTitle}>
        <Text style={styles.screenTitleText}>My Folders</Text>
      </View>
      <View>
        <FolderC folderName={"2024"} />
        <FolderC folderName={"2023"} />
        <FolderC folderName={"2022"} />
        <FolderC folderName={"2021"} />
      </View>
      {/* <Pressable onPress={() => console.log("1")} style={styles.addIconButton}>
        <Icon name="add" size={wp(7)} style={styles.addIcon} color="white" />
      </Pressable> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: StatusBar.currentHeight,
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
  addIconButton: {
    position: "absolute",
    left: wp(40),
    bottom: hp(4),
    width: wp(20),
    height: wp(20),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
    borderColor: "#C3E8FA",
    borderWidth: wp(2),
    backgroundColor: "#9068FF",
  },
});
