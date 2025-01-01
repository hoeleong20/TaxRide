import React, { useContext } from "react";
import { FilesContext } from "../../FilesContext";
import { useRouter } from "expo-router";

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
  StatusBar,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FolderC from "../../../components/FolderC";

export default function FilesScreen() {
  const { structuredData } = useContext(FilesContext);
  const { years } = structuredData;
  const router = useRouter();

  if (!years) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.innerContainer}>
        <View style={styles.screenTitle}>
          <Text style={styles.screenTitleText}>My Folders</Text>
        </View>

        <View>
          {Object.keys(years).map((year) => (
            <FolderC
              key={year}
              folderName={year}
              onPress={() => router.push(`/FilesScreen/FilesYScreen/${year}`)}
            />
          ))}
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
