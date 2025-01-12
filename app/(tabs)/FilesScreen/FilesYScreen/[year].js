import React, { useContext, useEffect } from "react";
import { FilesContext } from "../../../FilesContext";
import { useLocalSearchParams, useRouter } from "expo-router";

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
  const { years } = structuredData;
  const { year } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!years[year]) {
      Alert.alert(
        "No Folders Found",
        "The selected year does not contain any folders. Returning to the previous screen.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  }, [years, year, router]);

  // Guard against missing data
  const categories = years[year] || {};

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View>
          <FileScreenTitleC screenTitleText={year} />
          <View>
            {Object.keys(categories).length > 0 ? (
              Object.keys(categories).map((category) => (
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
