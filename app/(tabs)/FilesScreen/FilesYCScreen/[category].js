import React, { useContext, useState } from "react";
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
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
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

  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [imageName, setImageName] = useState("");

  const [activeDropdown, setActiveDropdown] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 }); // Dropdown position

  if (!year || !category || !years[year]?.[category]) {
    return <Text>Files not found for the selected year and category.</Text>;
  }

  const files = years[year][category];

  const openFile = (fileName, fileUri) => {
    if (!fileUri || !fileUri.startsWith("https://")) {
      Alert.alert("Invalid or inaccessible file URI.");
      return;
    }
    setActiveDropdown(null);
    setModalVisible(true);
    setImageName(fileName);
    setImageUri(fileUri);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(
      new Date(dateString)
    );
  };

  const handleMenuPress = (fileId, x, y) => {
    setDropdownPosition({ x, y });
    setActiveDropdown(activeDropdown === fileId ? null : fileId);
  };

  const formatSize = (sizeInBytes) => {
    if (!sizeInBytes) return "--";
    return `${Math.round(sizeInBytes / 1024)} KB`; // Convert to KB and round off
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setActiveDropdown(null); // Dismiss dropdown when tapping outside
        Keyboard.dismiss(); // Dismiss keyboard if open
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
                    // onEdit={() => console.log("Edit clicked for", file.fileName)}
                    // onDownload={() =>
                    //   console.log("Download clicked for", file.fileName)
                    // }
                    // onDelete={() =>
                    //   console.log("Delete clicked for", file.fileName)
                    // }
                    onMenuPress={(x, y) => handleMenuPress(file.id, x, y)} // Pass position for dropdown
                  />
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Dropdown menu */}
          {activeDropdown && (
            <View
              style={[
                styles.dropdownMenu,
                { top: dropdownPosition.y, left: dropdownPosition.x },
              ]}
            >
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setActiveDropdown(null);
                  Alert.alert("Edit File", "Editing file...");
                }}
              >
                <Text style={styles.menuText}>Edit</Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setActiveDropdown(null);
                  Alert.alert("Download File", "Downloading file...");
                }}
              >
                <Text style={styles.menuText}>Download</Text>
              </Pressable>
              <Pressable
                style={styles.lastMenuItem}
                onPress={() => {
                  setActiveDropdown(null);
                  Alert.alert("Delete File", "Deleting file...");
                }}
              >
                <Text style={styles.menuText}>Delete</Text>
              </Pressable>
            </View>
          )}

          {imageUri && (
            <ImagePreviewC
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              imageUri={imageUri}
              imageName={imageName}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: StatusBar.currentHeight,
    overflow: "visible",
    position: "relative", // Ensure dropdown aligns relative to the parent
  },
  dropdownMenu: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: wp(2),
    paddingVertical: hp(0.5),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    zIndex: 1000,
    width: wp(30),
  },
  menuItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  lastMenuItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderBottomColor: "#E0E0E0",
  },
  menuText: {
    fontSize: wp(4),
    color: "#000",
  },
});
