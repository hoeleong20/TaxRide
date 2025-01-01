import React, { useContext } from "react";
import { FilesContext } from "../../../FilesContext";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Text, View, StyleSheet, StatusBar, SafeAreaView } from "react-native";
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

  if (!year || !years[year]) return <Text>Year not found.</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FileScreenTitleC screenTitleText={year} />
        <View>
          {Object.keys(years[year]).map((category) => (
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
          ))}
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
