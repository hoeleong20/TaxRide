import React, { useContext } from "react";
import { FilesContext } from "../../FilesContext";
import { useRouter } from "expo-router";

import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
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
  const router = useRouter();

  // Group files by year
  const groupedFiles = structuredData.reduce((acc, file) => {
    const [year] = file.name.split("-"); // Extract year from the file name
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(file);
    return acc;
  }, {});

  // Check if there are no files
  if (structuredData.length === 0) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.placeholderText}>No files available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.innerContainer}>
        <View style={styles.screenTitle}>
          <Text style={styles.screenTitleText}>My Folders</Text>
        </View>

        <View>
          {Object.keys(groupedFiles).map((year) => (
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
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: wp(4),
    color: "#6B7280",
  },
});
