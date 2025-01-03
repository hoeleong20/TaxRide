import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Modal,
  SafeAreaView,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FileC from "../../../components/FileC";
import FileScreenTitleC from "../../../components/FileScreenTitleC";
import ImagePreviewC from "../../../components/ImagePreviewC";
import { FilesContext } from "../../FilesContext";

export default function RecentFilesScreen() {
  const { structuredData } = useContext(FilesContext); // Access structuredData
  const [filesLast30Days, setFilesLast30Days] = useState([]);

  // Image Preview State
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [imageName, setImageName] = useState("");
  const [fileYear, setFileYear] = useState("");
  const [fileCategory, setFileCategory] = useState("");

  useEffect(() => {
    if (structuredData.years) {
      // Flatten files from structuredData
      const allFiles = Object.entries(structuredData.years).flatMap(
        ([year, categories]) =>
          Object.entries(categories).flatMap(([category, files]) => {
            return files.map((file) => ({ ...file, year, category }));
          })
      );

      // Calculate the date 30 days ago
      const currentDate = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);

      // Filter files modified within the last 30 days
      const filteredFiles = allFiles.filter((file) => {
        const fileDate = new Date(file.modifiedTime);
        return fileDate >= thirtyDaysAgo && fileDate <= currentDate;
      });

      // Sort files by modified time in descending order (latest first)
      const sortedFiles = filteredFiles.sort(
        (a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime)
      );

      setFilesLast30Days(sortedFiles);
    }
  }, [structuredData]);

  const openImagePreview = (file) => {
    setImageUri(file.directLink);
    setImageName(file.fileName);
    setFileYear(file.year);
    setFileCategory(file.category);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FileScreenTitleC screenTitleText={"Recent Files"} />
      {filesLast30Days.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filesLast30Days}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => openImagePreview(item)}>
              <FileC
                fileName={item.fileName}
                fileDate={new Date(item.modifiedTime).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
                fileSize={`${Math.round(item.size / 1024)} KB`} // Convert size to KB
              />
            </Pressable>
          )}
        />
      ) : (
        <Text style={styles.noFilesText}>
          No files modified in the last 30 days.
        </Text>
      )}

      {modalVisible && (
        <ImagePreviewC
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          imageUri={imageUri}
          imageName={imageName}
          fileYear={fileYear}
          fileCategory={fileCategory}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: hp(2),
    height: hp(90),
  },
  noFilesText: {
    fontSize: hp(2),
    color: "#8391A1",
    textAlign: "center",
    marginTop: hp(5),
  },
});
