import React, { useContext, useState, useEffect, useCallback } from "react";
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
import Dialog from "react-native-dialog";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { BASE_URL } from "@env";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export default function FilesYCScreen() {
  const { structuredData } = useContext(FilesContext);
  const { refreshFiles } = useContext(FilesContext);
  const { years } = structuredData;
  const { year, category } = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [imageName, setImageName] = useState("");

  const [activeDropdown, setActiveDropdown] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editedYear, setEditedYear] = useState(year);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedFilename, setEditedFilename] = useState("");

  const [openYear, setOpenYear] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const onYearOpen = useCallback(() => {
    setOpenCategory(false);
  }, []);

  const onCategoryOpen = useCallback(() => {
    setOpenYear(false);
  }, []);

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

  const handleEditSubmit = async (fileId) => {
    try {
      console.log(fileId);
      const response = await axios.patch(`${BASE_URL}/edit-file`, {
        fileId,
        year: editedYear,
        category: editedCategory,
        filename: editedFilename,
      });

      Alert.alert("Success", response.data.message);
      setEditDialogVisible(false);
      setActiveDropdown(null);
      refreshFiles();
    } catch (error) {
      console.error("Error updating file:", error);
      Alert.alert("Error", "Failed to update file details.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete-file/${fileId}`);
      Alert.alert("Success", response.data.message);
      setDeleteDialogVisible(false);
      setActiveDropdown(null);
      refreshFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      Alert.alert("Error", "Failed to delete file.");
    }
  };

  const [yearsOption, setYearsOption] = useState([]);
  const [categoriesOption, setCategoriesOption] = useState([]);

  useEffect(() => {
    // Fetch years
    axios.get(`${BASE_URL}/years`).then((response) => {
      setYearsOption(response.data);
    });

    // Fetch categories
    axios.get(`${BASE_URL}/categories`).then((response) => {
      setCategoriesOption(response.data);
    });
  }, []);

  const downloadFile = async (fileUri, fileName) => {
    try {
      console.log("Original File Name:", fileName);

      // Sanitize file name to prevent directory issues
      const sanitizedFileName = fileName.replace(/[^\w.-]/g, "_");
      console.log("Sanitized File Name:", sanitizedFileName);

      // Define the file path
      const directoryPath = `${FileSystem.documentDirectory}downloads/`;
      const filePath = `${directoryPath}${sanitizedFileName}`;
      console.log("Download Path:", filePath);

      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(directoryPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directoryPath, {
          intermediates: true,
        });
        console.log("Created Directory:", directoryPath);
      }

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Storage permission is required.");
        return;
      }

      // Download the file
      console.log(`Downloading from ${fileUri} to ${filePath}`);
      const downloadResult = await FileSystem.downloadAsync(fileUri, filePath);

      // console.log("Download Result:", downloadResult);

      // Extract MIME type from headers
      const mimeType = downloadResult.headers["content-type"];
      console.log("MIME Type:", mimeType);

      // Map MIME type to file extension
      const mimeToExtension = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "application/pdf": ".pdf",
        "text/plain": ".txt",
        // Add other MIME types as needed
      };

      const extension = mimeToExtension[mimeType];
      if (!extension) {
        throw new Error("Could not get the file's extension.");
      }

      // Rename the file with the correct extension
      const finalFilePath = `${filePath}${extension}`;
      await FileSystem.moveAsync({
        from: downloadResult.uri,
        to: finalFilePath,
      });

      console.log("Final File Path:", finalFilePath);

      // Save to MediaLibrary
      const asset = await MediaLibrary.createAssetAsync(finalFilePath);
      await MediaLibrary.createAlbumAsync("TaxRide", asset, false);

      Alert.alert(
        "Download Success",
        `${sanitizedFileName}${extension} has been downloaded.`
      );
    } catch (error) {
      console.error("Download Error:", error.message || error);
      Alert.alert(
        "Error",
        `Failed to download the file: ${error.message || error}`
      );
    }
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
                    fileDate={formatDate(file.modifiedTime)}
                    fileSize={formatSize(file.size)}
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
                  setEditDialogVisible(true);
                }}
              >
                <Text style={styles.menuText}>Edit</Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  const file = files.find((f) => f.id === activeDropdown);
                  downloadFile(file.directLink, file.fileName);
                }}
              >
                <Text style={styles.menuText}>Download</Text>
              </Pressable>
              <Pressable
                style={styles.lastMenuItem}
                onPress={() => {
                  setDeleteDialogVisible(true);
                }}
              >
                <Text style={styles.menuText}>Delete</Text>
              </Pressable>
            </View>
          )}

          {/* Edit Dialog */}
          <Dialog.Container visible={editDialogVisible}>
            <Dialog.Title>Edit File</Dialog.Title>
            <DropDownPicker
              open={openYear}
              onOpen={onYearOpen}
              value={editedYear} // Current value is the default
              items={[
                { label: editedYear, value: editedYear }, // Add current value explicitly as the first item
                ...yearsOption.filter((yr) => yr.value !== editedYear), // Append the rest, excluding the current value
              ]}
              setOpen={setOpenYear}
              setValue={setEditedYear}
              placeholder="Select Year"
              style={{
                marginBottom: 15,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
              dropDownContainerStyle={{
                maxHeight: 120, // Restrict height to allow scrolling
                borderWidth: 1,
                borderColor: "#ccc",
                zIndex: 3000, // Ensure it appears above other elements
              }}
              zIndex={2000} // Ensure dropdown is above other elements
              zIndexInverse={1000} // Prevent overlap with other components
            />
            <DropDownPicker
              open={openCategory}
              onOpen={onCategoryOpen}
              value={editedCategory} // Current value is the default
              items={[
                { label: editedCategory, value: editedCategory }, // Add current value explicitly as the first item
                ...categoriesOption.filter(
                  (cat) => cat.value !== editedCategory
                ), // Append the rest, excluding the current value
              ]}
              setOpen={setOpenCategory}
              setValue={setEditedCategory}
              placeholder="Select Category"
              style={{
                marginBottom: 15,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
              dropDownContainerStyle={{
                maxHeight: 120, // Restrict height to allow scrolling
                borderWidth: 1,
                borderColor: "#ccc",
                zIndex: 3000, // Ensure it appears above other elements
              }}
              zIndex={2000} // Ensure dropdown is above other elements
              zIndexInverse={1000} // Prevent overlap with other components
            />
            <Dialog.Input
              placeholder="File Name"
              value={editedFilename}
              onChangeText={setEditedFilename}
            />
            <Dialog.Button
              label="Cancel"
              onPress={() => setEditDialogVisible(false)}
            />
            <Dialog.Button
              label="Submit"
              onPress={() => handleEditSubmit(activeDropdown)}
            />
          </Dialog.Container>

          {/* Delete Dialog */}
          <Dialog.Container visible={deleteDialogVisible}>
            <Dialog.Title>Delete File</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this file? This action cannot be
              undone.
            </Dialog.Description>
            <Dialog.Button
              label="No"
              onPress={() => setDeleteDialogVisible(false)}
            />
            <Dialog.Button
              label="Yes"
              onPress={() => handleDeleteFile(activeDropdown)}
            />
          </Dialog.Container>

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
