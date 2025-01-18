import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Pressable,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useState, useEffect, useCallback, useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NotificationButtonC from "../../../components/NotificationButtonC";
import StorageUsageBarC from "../../../components/StorageUsageBarC";
import Icon from "react-native-vector-icons/Ionicons";
import FileC from "../../../components/FileC";
import ImagePreviewC from "../../../components/ImagePreviewC";
import Dialog from "react-native-dialog";
import DropDownPicker from "react-native-dropdown-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { FilesContext } from "../../FilesContext";
import { LoginContext } from "../../LoginContext";

import { Link } from "expo-router";

const profileImage = require("../../../assets/userProfile.jpg");
// const BASE_URL = "http://192.168.1.39:3000";
import { BASE_URL } from "@env";
import axios from "axios";

export default function HomeScreen() {
  const { loggedInEmail } = useContext(LoginContext);

  const [name, setName] = useState("Ayush Srivastava");
  const [cloudStoragePerc, setCloudStoragePerc] = useState(0);
  const [cloudStorageText, setCloudStorageText] = useState("Loading...");
  const [internalStoragePerc, setInternalStoragePerc] = useState(0);
  const [internalStorageText, setInternalStorageText] = useState("Loading...");
  const [imageName, setImageName] = useState("");
  const [recentFiles, setRecentFiles] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");

  const [activeDropdown, setActiveDropdown] = useState("");
  const [activeFileName, setActiveFileName] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editedYear, setEditedYear] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedFilename, setEditedFilename] = useState("");
  const [fileExtension, setFileExtension] = useState("");

  const [openYear, setOpenYear] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const { structuredData } = useContext(FilesContext);
  const { refreshFiles } = useContext(FilesContext);

  const onYearOpen = useCallback(() => {
    setOpenCategory(false);
  }, []);

  const onCategoryOpen = useCallback(() => {
    setOpenYear(false);
  }, []);

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

  useEffect(() => {
    const fetchCloudStorage = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/gdrive/storage`, {
          params: { email: loggedInEmail },
        });

        const { used, total } = response.data;
        const percentageUsed = Math.floor((used / total) * 100);

        // Update state for cloud storage
        setCloudStoragePerc(percentageUsed);

        // Format values for display (e.g., GB or TB)
        const usedGB = (used / 1024 ** 3).toFixed(2); // Convert bytes to GB
        const totalGB = total / 1024 ** 3; // Convert bytes to GB

        setCloudStorageText(`${usedGB} GB of ${totalGB} GB used`);
      } catch (error) {
        console.error("Error fetching cloud storage:", error.message);
        Alert.alert("Error", "Failed to load cloud storage data.");
      }
    };

    fetchCloudStorage();
  }, [refreshFiles]);

  useEffect(() => {
    const fetchInternalStorage = async () => {
      try {
        const storageInfo = await FileSystem.getFreeDiskStorageAsync();
        const totalStorage = await FileSystem.getTotalDiskCapacityAsync();

        const usedStorage = totalStorage - storageInfo;
        const percentageUsed = Math.round((usedStorage / totalStorage) * 100);

        setInternalStoragePerc(percentageUsed);

        // Format for human-readable text
        const usedGB = (usedStorage / 1024 ** 3).toFixed(2);
        const totalGB = (totalStorage / 1024 ** 3).toFixed(2);

        setInternalStorageText(`${usedGB} GB of ${totalGB} GB used`);
      } catch (error) {
        console.error("Error fetching internal storage:", error.message);
        Alert.alert("Error", "Failed to load internal storage data.");
      }
    };

    fetchInternalStorage();
  }, []);

  const openFile = (file) => {
    const [year, category, ...rest] = file.name.split("-");
    setEditedYear(year); // Extract and set year
    setEditedCategory(category); // Extract and set category
    setImageUri(file.directLink);

    setImageName(rest.join("-")); // Set only the filename
    setFileExtension(file.name.match(/\.[^/.]+$/)?.[0] || ""); // Extract extension or default to empty string
    setModalVisible(true);

    setActiveDropdown(null);
  };

  // Extract filename without year and category
  const extractFileName = (fullName) => {
    const parts = fullName.split("-");
    const nameWithoutYearAndCategory = parts.slice(2).join("-"); // Skip the year and category
    return nameWithoutYearAndCategory.replace(/\.[^/.]+$/, ""); // Remove the file extension
  };

  // Fetch recent files
  const fetchRecentFiles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/files`, {
        params: { email: loggedInEmail },
      });

      const files = response.data;

      // Sort files by modified time in descending order
      const sortedFiles = files.sort(
        (a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime)
      );

      // Take the top two most recent files
      setRecentFiles(sortedFiles.slice(0, 2));
    } catch (error) {
      console.error("Error fetching recent files:", error.message);
      Alert.alert("Error", "Failed to load recent files.");
    }
  };

  useEffect(() => {
    fetchRecentFiles();
  }, [structuredData]);

  const handleMenuPress = (fileId, fileName, x, y) => {
    setDropdownPosition({ x, y });
    setActiveDropdown(activeDropdown === fileId ? null : fileId);
    setActiveFileName(fileName);

    // Find the selected file by its ID
    const file = recentFiles.find((file) => file.id === fileId);

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
    
      const updatedFilename = editedFilename.endsWith(fileExtension)
        ? editedFilename
        : `${editedFilename}${fileExtension}`;

      const response = await axios.patch(
        `${BASE_URL}/edit-file?email=${loggedInEmail}`,
        {
          fileId,
          year: editedYear,
          category: editedCategory,
          filename: updatedFilename,
        }
      );

      Alert.alert("Success", response.data.message);
      setEditDialogVisible(false);
      setActiveDropdown(null);

      // Update state to reflect changes in ImagePreviewC
      setImageName(updatedFilename);
      setEditedYear(editedYear);
      setEditedCategory(editedCategory);
      setEditedFilename("");

      await refreshFiles();
    } catch (error) {
      console.error("Error updating file:", error);
      Alert.alert("Error", "Failed to update file details.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      console.log("Deleting file with ID:", fileId); // Add this to debug

      const response = await axios.delete(
        `${BASE_URL}/delete-file/${fileId}?email=${loggedInEmail}` // Add email to query string
      );
      Alert.alert("Success", response.data.message);
      setDeleteDialogVisible(false);
      setActiveDropdown(null);
      await refreshFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      Alert.alert("Error", "Failed to delete file.");
    }
  };

  const handleCancelDeleteFile = async () => {
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
    setEditedFilename("");
    setActiveDropdown(null);
  };

  const downloadFile = async (fileUri, fileName) => {
    try {
      console.log("Original File Name:", fileName);

      // Extract the actual file name (removing year and category)
      const parts = fileName.split("-");
      const actualFileName = parts.slice(2).join("-"); // Skip the first two parts (year and category)
      // Remove any existing extension before sanitizing
      const nameWithoutExtension = actualFileName.replace(/\.[^/.]+$/, "");
      console.log("File Name Without Extension:", nameWithoutExtension);

      // Sanitize file name to prevent directory issues
      const sanitizedFileName = nameWithoutExtension.replace(/[^\w.-]/g, "_");
      console.log("Sanitized File Name:", sanitizedFileName);

      // Alert user to confirm download
      Alert.alert(
        "Download Confirmation",
        `Do you want to download "${sanitizedFileName}"?`,
        [
          {
            text: "Cancel",
            onPress: () => {
              console.log("Download canceled");
              Alert.alert(
                "Download Canceled",
                `The download of "${sanitizedFileName}" has been canceled.`
              );
            },
            style: "cancel", // Sets style for the button
          },
          {
            text: "Download",
            onPress: async () => {
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
                Alert.alert(
                  "Permission Denied",
                  "Storage permission is required."
                );
                return;
              }

              // Download the file
              console.log(`Downloading from ${fileUri} to ${filePath}`);
              const downloadResult = await FileSystem.downloadAsync(
                fileUri,
                filePath
              );

              // Extract MIME type from headers
              const mimeType = downloadResult.headers["content-type"];
              console.log("MIME Type:", mimeType);

              // Map MIME type to file extension
              const mimeToExtension = {
                "image/jpg": ".jpg",
                "image/jpeg": ".jpeg",
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

              setActiveDropdown(null);
            },
          },
        ]
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
        setActiveDropdown(null);
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.innerContainer}>
          <View style={styles.concreteContainer}>
            <View style={styles.topBar}>
              <View style={styles.profileContainer}>
                <Image source={profileImage} style={styles.profileImageStyle} />
                <View style={styles.profileTextContainer}>
                  <Text style={styles.profileText1}>Welcome</Text>
                  <Text style={styles.profileText2}>{name}</Text>
                </View>
              </View>
              <View style={styles.notificationButton}>
                <NotificationButtonC />
              </View>
            </View>
            <View>
              <Text style={[styles.titleText, styles.marginBtm]}>
                Storage Usage
              </Text>
              <View style={styles.StorageUsageContainer}>
                <StorageUsageBarC storagePerc={cloudStoragePerc} />
                <View style={styles.StorageUsageText}>
                  <Text style={styles.StorageUsageText1}>Cloud Storage</Text>
                  <Text style={styles.StorageUsageText2}>
                    {cloudStorageText}
                  </Text>
                </View>
              </View>
              <View style={styles.StorageUsageContainer}>
                <StorageUsageBarC storagePerc={internalStoragePerc} />
                <View style={styles.StorageUsageText}>
                  <Text style={styles.StorageUsageText1}>Internal Storage</Text>
                  <Text style={styles.StorageUsageText2}>
                    {internalStorageText}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.rowContainer}>
                <Text style={styles.titleText}>Recent Files</Text>
                <View style={styles.altContainer}>
                  <Link href="/(tabs)/HomeScreen/RecentFilesScreen">
                    <Text style={styles.altText}>View More</Text>
                  </Link>
                  <Icon
                    name="arrow-forward-sharp"
                    size={wp(5)}
                    color="#0066FF"
                  />
                </View>
              </View>
              <View>
                {recentFiles.map((file, index) => (
                  <Pressable key={file.id} onPress={() => openFile(file)}>
                    <FileC
                      fileName={extractFileName(file.name)}
                      fileDate={new Date(file.modifiedTime).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                      fileSize={`${Math.round(file.size / 1024)} KB`} // Convert size to KB
                      onMenuPress={(x, y) =>
                        handleMenuPress(
                          file.id,
                          extractFileName(file.name),
                          x - wp(4),
                          index === 1 ? y - hp(25) : y - hp(3) // Adjust y position for the second file
                        )
                      }
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
          {imageUri && (
            <ImagePreviewC
              key={`${imageUri}-${imageName}-${editedYear}-${editedCategory}`}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              imageUri={imageUri}
              imageName={imageName}
              fileId={activeDropdown}
              fileYear={editedYear}
              fileCategory={editedCategory}
            />
          )}

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
                  const file = recentFiles.find((f) => f.id === activeDropdown);
                  downloadFile(file.directLink, file.name);
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
              onPress={() => {
                setEditDialogVisible(false);
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
                handleCancelDeleteFile();
              }}
            />
            <Dialog.Button
              label="Yes"
              onPress={() => handleDeleteFile(activeDropdown)}
            />
          </Dialog.Container>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },
  concreteContainer: {
    overflow: "visible",
    position: "relative", // Ensure dropdown aligns relative to the parent
  },
  innerContainer: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: wp(4),
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileContainer: {
    flexDirection: "row",
  },
  profileImageStyle: {
    width: wp(18),
    height: hp(8),
    marginBottom: hp(2),
  },
  profileTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: wp(5),
  },
  profileText1: {
    fontSize: hp(2),
  },
  profileText2: {
    fontWeight: "800",
    fontSize: hp(2.5),
  },
  notificationButton: {
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  titleText: {
    fontSize: hp(3),
    fontWeight: "700",
    textAlign: "left",
  },
  marginBtm: {
    marginBottom: hp(3),
  },
  StorageUsageContainer: {
    flexDirection: "row",
    marginBottom: hp(2),
    backgroundColor: "#FFFFFF",
    padding: wp(4),
    borderRadius: wp(2),
    borderColor: "#F3F4F6",
    borderWidth: wp(0.5),
  },
  StorageUsageText: {
    justifyContent: "center",
    paddingHorizontal: wp(6),
  },
  StorageUsageText1: {
    color: "#6B7280",
    marginBottom: hp(1),
  },
  StorageUsageText2: {
    fontWeight: "600",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    marginVertical: hp(2),
  },
  altContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  altText: {
    fontSize: hp(2.5),
    color: "#0066FF",
    fontWeight: "600",
    marginRight: wp(2),
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
