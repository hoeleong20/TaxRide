import React, { useContext } from "react";
import { FilesContext } from "../../../FilesContext";
import { useLocalSearchParams } from "expo-router";

import {
  Text,
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FileC from "../../../../components/FileC";
import FileScreenTitleC from "../../../../components/FileScreenTitleC";
import ImagePreviewC from "../../../../components/ImagePreviewC";

export default function FilesYCScreen() {
  const { structuredData } = useContext(FilesContext);
  const { years } = structuredData;
  const { year, category } = useLocalSearchParams();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [imageUri, setImageUri] = React.useState("");
  const [imageName, setImageName] = React.useState("");

  if (!year || !category || !years[year]?.[category]) {
    return <Text>Files not found for the selected year and category.</Text>;
  }

  const files = years[year][category];

  const openFile = (fileName, fileUri) => {
    if (!fileUri || !fileUri.startsWith("https://")) {
      Alert.alert("Invalid or inaccessible file URI.");
      return;
    }
    setModalVisible(true);
    setImageName(fileName);
    setImageUri(fileUri);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
  };

  const formatSize = (sizeInBytes) => {
    if (!sizeInBytes) return "--";
    return `${Math.round(sizeInBytes / 1024)} KB`; // Convert to KB and round off
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <FileScreenTitleC screenTitleText={`${category}`} />
        <View>
          {files.map((file) => (
            <Pressable
              key={file.id}
              onPress={() => openFile(file.fileName, file.directLink)}
            >
              <FileC
                fileName={file.fileName}
                fileDate={formatDate(file.modifiedTime)} // Format date
                fileSize={formatSize(file.size)} // Format size
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {imageUri && (
        <ImagePreviewC
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          imageUri={imageUri}
          imageName={imageName}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: StatusBar.currentHeight,
  },
});
