import React, { useContext, useEffect } from "react";
import { FilesContext } from "../../../FilesContext";
import { useLocalSearchParams, router } from "expo-router";

import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FileScreenTitleC from "../../../../components/FileScreenTitleC";
import FolderC from "../../../../components/FolderC";

export default function FilesYScreen() {
  const { structuredData } = useContext(FilesContext);
  const { year } = useLocalSearchParams(); // Get the year parameter from route

  // Group files by category for the selected year
  const categories = structuredData
    .filter((file) => file.name.startsWith(`${year}-`))
    .reduce((acc, file) => {
      const [, category] = file.name.split("-");
      if (!acc.includes(category)) acc.push(category);
      return acc;
    }, []);

  useEffect(() => {
    if (categories.length === 0) {
      Alert.alert(
        "No Folders Found",
        "The selected year does not contain any folders. Returning to the previous screen.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  }, [categories, router]);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View>
          <FileScreenTitleC screenTitleText={year} />
          <View>
            {categories.length > 0 ? (
              categories.map((category) => (
                <FolderC
                  key={category}
                  folderName={category}
                  onPress={() =>
                    router.push({
                      pathname: `../FilesYCScreen/${category}`,
                      params: { year },
                    })
                  }
                />
              ))
            ) : (
              <Text style={styles.noFoldersText}>
                No folders available for this year.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: wp(7),
  },
  noFoldersText: {
    marginTop: hp(3),
    textAlign: "center",
    color: "gray",
    fontSize: hp(2),
  },
});
