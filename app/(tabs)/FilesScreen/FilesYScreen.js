import { Text, View, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FileScreenTitleC from "../../../components/FileScreenTitleC";
import FolderC from "../../../components/FolderC";

export default function FilesYScreen() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <FileScreenTitleC screenTitleText={"2023"} />
        <View>
          <FolderC
            folderName={"Education"}
            navigateToPath="/(tabs)/FilesScreen/FilesYCScreen"
          />
          <FolderC
            folderName={"Medical"}
            navigateToPath="/(tabs)/FilesScreen/FilesYCScreen"
          />
          <FolderC
            folderName={"Lifestyle"}
            navigateToPath="/(tabs)/FilesScreen/FilesYCScreen"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: wp(7),
  },
});
