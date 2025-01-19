import React, { useContext, useState, useEffect, useCallback } from "react";
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
import FileC from "../../../components/FileC";
import FileScreenTitleC from "../../../components/FileScreenTitleC";
import ImagePreviewC from "../../../components/ImagePreviewC";
import Dialog from "react-native-dialog";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { BASE_URL } from "@env";
import { FilesContext } from "../../FilesContext";
import { LoginContext } from "../../LoginContext";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export default function FilesYCScreen() {
  const { loggedInEmail } = useContext(LoginContext);
  const { structuredData, refreshFiles } = useContext(FilesContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageId, setModalImageId] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [imageName, setImageName] = useState("");

  const [activeDropdown, setActiveDropdown] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editedYear, setEditedYear] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedFilename, setEditedFilename] = useState("");

  const [openYear, setOpenYear] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [yearsOption, setYearsOption] = useState([]);
  const [categoriesOption, setCategoriesOption] = useState([]);
  const [activeFileName, setActiveFileName] = useState("");
  const [fileExtension, setFileExtension] = useState("");

  const onYearOpen = useCallback(() => setOpenCategory(false), []);
  const onCategoryOpen = useCallback(() => setOpenYear(false), []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/years`)
      .then((response) => setYearsOption(response.data));
    axios
      .get(`${BASE_URL}/categories`)
      .then((response) => setCategoriesOption(response.data));
  }, []);

  const extractFileName = (fullName) => {
    const parts = fullName.split("-");
    const nameWithoutYearCategory = parts.slice(2).join("-");
    const nameWithoutExtension = nameWithoutYearCategory.replace(
      /\.[^/.]+$/,
      ""
    );
    return nameWithoutExtension;
  };

  const downloadFile = async (fileUri, fileName) => {
    try {
      if (!fileName) {
        throw new Error("File name is required for downloading.");
      }

      const nameParts = fileName.split("-");
      const actualFileName = nameParts[nameParts.length - 1].replace(
        /\.[^/.]+$/,
        ""
      );
      const sanitizedFileName = actualFileName.replace(/[^\w.-]/g, "_");

      const directoryPath = `${FileSystem.documentDirectory}downloads/`;
      const filePath = `${directoryPath}${sanitizedFileName}`;

      const dirInfo = await FileSystem.getInfoAsync(directoryPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directoryPath, {
          intermediates: true,
        });
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Storage permission is required.");
        return;
      }

      const downloadResult = await FileSystem.downloadAsync(fileUri, filePath);

      const mimeType = downloadResult.headers["content-type"];
      const mimeToExtension = {
        "image/jpg": ".jpg",
        "image/jpeg": ".jpeg",
        "image/png": ".png",
        "application/pdf": ".pdf",
        "text/plain": ".txt",
      };

      const extension = mimeToExtension[mimeType];
      if (!extension) {
        throw new Error("Could not determine file's extension.");
      }

      const finalFilePath = `${filePath}${extension}`;
      await FileSystem.moveAsync({
        from: downloadResult.uri,
        to: finalFilePath,
      });

      const asset = await MediaLibrary.createAssetAsync(finalFilePath);
      await MediaLibrary.createAlbumAsync("TaxRide", asset, false);

      Alert.alert(
        "Download Success",
        `${sanitizedFileName}${extension} has been downloaded.`
      );
      setActiveDropdown(null);
    } catch (error) {
      Alert.alert(
        "Error",
        `Failed to download the file: ${error.message || error}`
      );
      setActiveDropdown(null);
    }
  };

  const handleEditSubmit = async (fileId) => {
    try {
      // Input validation
      if (!editedYear) {
        Alert.alert("Validation Error", "Please select a valid year.");
        return;
      }

      if (!editedCategory) {
        Alert.alert("Validation Error", "Please select a valid category.");
        return;
      }

      if (!editedFilename || editedFilename.trim() === "") {
        Alert.alert("Validation Error", "Filename cannot be empty.");
        return;
      }

      const response = await axios.patch(
        `${BASE_URL}/edit-file?email=${loggedInEmail}`, // Add email to query string
        {
          fileId,
          year: editedYear,
          category: editedCategory,
          filename: editedFilename,
        }
      );

      Alert.alert("Success", response.data.message);
      setEditDialogVisible(false);
      setActiveDropdown(null);
      setEditedFilename("");

      await refreshFiles();
    } catch (error) {
      Alert.alert("Error", "Failed to update file details.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/delete-file/${fileId}?email=${loggedInEmail}` // Add email to query string
      );
      Alert.alert("Success", response.data.message);
      setDeleteDialogVisible(false);
      setActiveDropdown(null);
      await refreshFiles();
    } catch (error) {
      Alert.alert("Error", "Failed to delete file.");
    }
  };

  const handleCancelDeleteFile = async (fileId) => {
    Alert.alert(
      "Deletion Canceled",
      `The deletion of "${activeFileName}" has been canceled.`
    );
    setActiveDropdown(null);
  };

  const handleCancelEditFile = async () => {
    Alert.alert(
      "Edit Canceled",
      `The edition of "${activeFileName}" has been canceled.`
    );
    setActiveDropdown(null);
    setEditedFilename("");
  };

  const setDetails = (fileName) => {
    if (fileName) {
      // Extract year, category, and filename from the file details
      const parts = fileName.split("-");
      const year = parts[0]; // Assuming the year is the first part of the name
      const category = parts[1]; // Assuming the category is the second part of the name

      // Assign values to hooks
      setEditedYear(year);
      setEditedCategory(category);
    }
  };

  const handleMenuPress = (fileId, fileName, x, y) => {
    setDropdownPosition({ x, y });
    setActiveDropdown(activeDropdown === fileId ? null : fileId);
    setActiveFileName(fileName);

    // Find the selected file by its ID
    const file = structuredData.find((file) => file.id === fileId);

    if (file) {
      // Extract year, category, and filename from the file details
      const parts = file.name.split("-");
      const year = parts[0]; // Assuming the year is the first part of the name
      const category = parts[1]; // Assuming the category is the second part of the name
      const filename = parts.slice(2).join("-"); // The rest is the filename

      // Assign values to hooks
      setEditedYear(year);
      setEditedCategory(category);
      setFileExtension(filename.match(/\.[^/.]+$/)?.[0] || ""); // Extract extension or default to empty string
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setActiveDropdown(null);
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView style={styles.container}>
            <FileScreenTitleC screenTitleText="Recent Files" />
            <View>
              {structuredData.length > 0 ? (
                structuredData.map((file) => (
                  <Pressable
                    key={file.id}
                    onPress={() => {
                      setModalImageId(file.id);
                      setModalVisible(true);
                      setImageUri(file.directLink);
                      setDetails(file.name);
                      setImageName(extractFileName(file.name));
                      setActiveDropdown(null);
                    }}
                  >
                    <FileC
                      key={file.id}
                      fileName={extractFileName(file.name)}
                      fileDate={new Date(file.modifiedTime).toLocaleDateString(
                        "en-GB"
                      )}
                      fileSize={`${Math.round(file.size / 1024)} KB`}
                      onMenuPress={(x, y) =>
                        handleMenuPress(
                          file.id,
                          extractFileName(file.name),
                          x,
                          y
                        )
                      }
                    />
                  </Pressable>
                ))
              ) : (
                <Text style={styles.noFilesText}>No files available.</Text>
              )}
            </View>

            {activeDropdown && (
              <View
                style={[
                  styles.dropdownMenu,
                  { top: dropdownPosition.y, left: dropdownPosition.x },
                ]}
              >
                <Pressable
                  style={styles.menuItem}
                  onPress={() => setEditDialogVisible(true)}
                >
                  <Text style={styles.menuText}>Edit</Text>
                </Pressable>
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    const file = structuredData.find(
                      (f) => f.id === activeDropdown
                    );
                    if (file) downloadFile(file.directLink, file.name);
                  }}
                >
                  <Text style={styles.menuText}>Download</Text>
                </Pressable>
                <Pressable
                  style={styles.lastMenuItem}
                  onPress={() => setDeleteDialogVisible(true)}
                >
                  <Text style={styles.menuText}>Delete</Text>
                </Pressable>
              </View>
            )}

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
                onPress={() => {
                  setEditDialogVisible(false);
                  setActiveDropdown(null);
                  handleCancelEditFile();
                }}
              />
              <Dialog.Button
                label="Submit"
                onPress={() => handleEditSubmit(activeDropdown)}
              />
            </Dialog.Container>

            <Dialog.Container visible={deleteDialogVisible}>
              <Dialog.Title>Delete File</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to delete this file? This action cannot be
                undone.
              </Dialog.Description>
              <Dialog.Button
                label="No"
                onPress={() => {
                  setDeleteDialogVisible(false);
                  setActiveDropdown(null);
                  handleCancelDeleteFile(activeDropdown);
                }}
              />
              <Dialog.Button
                label="Yes"
                onPress={() => {
                  handleDeleteFile(activeDropdown);
                }}
              />
            </Dialog.Container>
            {imageUri && modalImageId && (
              <ImagePreviewC
                key={`${imageUri}-${imageName}-${editedYear}-${editedCategory}`}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                imageUri={imageUri}
                imageName={imageName}
                fileId={modalImageId}
                year={editedYear}
                category={editedCategory}
              />
            )}
          </ScrollView>
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
    position: "relative",
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
  },
  menuText: {
    fontSize: wp(4),
    color: "#000",
  },
  noFilesText: {
    marginTop: hp(3),
    textAlign: "center",
    color: "gray",
    fontSize: hp(2),
  },
});
