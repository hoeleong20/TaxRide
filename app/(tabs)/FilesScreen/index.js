import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
  TextInput,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import { StatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FolderC from "../../../components/FolderC";

const logoImg = require("../../../assets/adaptive-icon.png");

export default function FilesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.innerContainer}>
        <View style={styles.screenTitle}>
          <Text style={styles.screenTitleText}>My Folders</Text>
        </View>
        <View>
          <FolderC
            folderName={"2024"}
            navigateToPath="/(tabs)/FilesScreen/FilesYScreen"
          />
          <FolderC
            folderName={"2023"}
            navigateToPath="/(tabs)/FilesScreen/FilesYScreen"
          />
          <FolderC
            folderName={"2022"}
            navigateToPath="/(tabs)/FilesScreen/FilesYScreen"
          />
          <FolderC
            folderName={"2021"}
            navigateToPath="/(tabs)/FilesScreen/FilesYScreen"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
  },
  innerContainer: {
    paddingHorizontal: wp(7),
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
});
