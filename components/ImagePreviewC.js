import {
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Dialog from "react-native-dialog";
import { BASE_URL } from "@env";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import { FilesContext } from "../app/FilesContext";
import { LoginContext } from "../app/LoginContext";

export default function ImagePreviewC({
  modalVisible,
  setModalVisible,
  imageUri,
  imageName,
  fileId,
  year,
  category,
}) {
  const { loggedInEmail } = useContext(LoginContext);
  const { refreshFiles } = useContext(FilesContext);

  const [aspectRatio, setAspectRatio] = useState(1);
  const { width: screenWidth } = Dimensions.get("window");

  const [headerVisible, setHeaderVisible] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(fileId);

  // console.log("file id ", fileId);
  // console.log("activeDropdown", activeDropdown);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editedYear, setEditedYear] = useState(year);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedFilename, setEditedFilename] = useState();
  const [currentImageName, setCurrentImageName] = useState(imageName);
  const [fileExtension, setFileExtension] = useState("");

  const [openYear, setOpenYear] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const onYearOpen = useCallback(() => {
    setOpenCategory(false);
  }, []);

  const onCategoryOpen = useCallback(() => {
    setOpenYear(false);
  }, []);

  const [yearsOption, setYearsOption] = useState([]);
  const [categoriesOption, setCategoriesOption] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/years`).then((response) => {
      setYearsOption(response.data);
    });
    axios.get(`${BASE_URL}/categories`).then((response) => {
      setCategoriesOption(response.data);
    });
  }, []);

  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const showHeaderWithAnimation = () => {
    setHeaderVisible(true);
    Animated.timing(headerTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideHeaderWithAnimation = () => {
    Animated.timing(headerTranslateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setHeaderVisible(false));
  };

  const toggleHeader = () => {
    if (headerVisible) {
      // console.log(
      //   modalVisible,
      //   imageUri,
      //   imageName,
      //   fileId,
      //   year,
      //   category
      // );
      setDropdownVisible(false);
      hideHeaderWithAnimation();
    } else {
      setDropdownVisible(false);
      showHeaderWithAnimation();
    }
  };

  const resetHeader = () => {
    setHeaderVisible(true);
    headerTranslateY.setValue(0);
  };

  useEffect(() => {
    if (modalVisible) {
      setDropdownVisible(false);
      resetHeader();
      setEditedYear(year);
      setEditedCategory(category);
      // console.log("file id ", fileId);
      // console.log("activeDropdown", activeDropdown);
    }
  }, [modalVisible, year, category, imageName, fileId]);

  const handleThreeDotsPress = (x, y) => {
    setDropdownVisible(true);
    setDropdownPosition({ x, y });
  };

  const handleDropdownAction = (action) => {
    setDropdownVisible(false);
    switch (action) {
      case "edit":
        setEditDialogVisible(true);
        break;
      case "download":
        downloadFile(imageUri, currentImageName);
        break;
      case "delete":
        setDeleteDialogVisible(true);
        break;
      default:
        console.warn("Unknown action:", action);
        break;
    }
  };

  const downloadFile = async (fileUri, fileName) => {
    try {
      const sanitizedFileName = fileName.replace(/[^\w.-]/g, "_");
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
      const mimeType =
        downloadResult.headers["Content-Type"] ||
        downloadResult.headers["content-type"];
      const mimeToExtension = {
        "image/jpg": ".jpg",
        "image/jpeg": ".jpeg",
        "image/png": ".png",
        "application/pdf": ".pdf",
        "text/plain": ".txt",
      };

      const extension = mimeToExtension[mimeType];
      if (!extension) {
        throw new Error("Could not get the file's extension.");
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
    } catch (error) {
      Alert.alert("Download Failed", error.message);
    }
  };

  const handleEditSubmit = async (fileId) => {
    try {
      if (!activeDropdown) {
        Alert.alert("Error", "No file selected for edit.");
        return;
      }
      fileId = activeDropdown;

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

      // Ensure the edited filename retains the correct extension
      const finalFilename = editedFilename.endsWith(fileExtension)
        ? editedFilename
        : `${editedFilename}${fileExtension}`;

      console.log(
        `Submitting edited file with ID: ${fileId}, Filename: ${finalFilename}`
      );

      const response = await axios.patch(
        `${BASE_URL}/edit-file?email=${loggedInEmail}`, // Add email to query string
        {
          fileId,
          year: editedYear,
          category: editedCategory,
          filename: editedFilename,
        }
      );
      console.log(response);

      Alert.alert("Success", response.data.message);
      setEditDialogVisible(false);
      await refreshFiles();
      setCurrentImageName(editedFilename);
      setEditedFilename("");
    } catch (error) {
      console.error("Error updating file:", error);
      Alert.alert("Error", "Failed to update file details.");
    }
  };

  const handleDeleteFile = async () => {
    if (!activeDropdown) {
      Alert.alert("Error", "No file selected for deletion.");
      return;
    }

    try {
      const response = await axios.delete(
        `${BASE_URL}/delete-file/${activeDropdown}?email=${loggedInEmail}`
      );
      Alert.alert("Success", response.data.message);
      setDeleteDialogVisible(false);
      await refreshFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      if (error.response && error.response.status === 404) {
        Alert.alert(
          "Error",
          "The file does not exist on the server or has already been deleted."
        );
      } else {
        Alert.alert("Error", "Failed to delete the file.");
      }
    }
  };

  const handleCancelDeleteFile = async () => {
    Alert.alert(
      "Deletion Canceled",
      `The deletion of "${currentImageName}" has been canceled.`
    );
    setActiveDropdown(null);
  };

  const handleCancelEditFile = async () => {
    Alert.alert(
      "Edit Canceled",
      `The edition of "${currentImageName}" has been canceled.`
    );
    setActiveDropdown(null);
  };

  const image = [
    {
      url: imageUri,
      props: {
        style: {
          width: screenWidth,
          height: screenWidth / aspectRatio,
        },
      },
    },
  ];

  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setAspectRatio(width / height);
        },
        (error) => {
          console.error("Error fetching image size:", error);
          setAspectRatio(1);
        }
      );
    }
  }, [imageUri]);

  const imageViewHeader = () => (
    <Animated.View
      style={[
        styles.headerContainer,
        { transform: [{ translateY: headerTranslateY }] },
      ]}
    >
      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={styles.exitButton}
      >
        <Ionicons name="close-sharp" size={wp(8)} color="white" />
      </TouchableOpacity>
      <Text style={styles.imageName}>{currentImageName}</Text>
      <TouchableOpacity
        onPress={(e) =>
          handleThreeDotsPress(
            e.nativeEvent.pageX + wp(3),
            e.nativeEvent.pageY + hp(3)
          )
        }
        style={styles.threeDots}
      >
        <Entypo name="dots-three-horizontal" size={wp(8)} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Modal visible={modalVisible} transparent={false}>
      <SafeAreaView style={styles.modalBackground}>
        <ImageViewer
          imageUrls={image}
          enableSwipeDown={true}
          saveToLocalByLongPress={false}
          onSwipeDown={() => setModalVisible(false)}
          renderHeader={() => imageViewHeader()}
          renderIndicator={() => null}
          enableImageZoom={true}
          onClick={toggleHeader}
        />
        {dropdownVisible && (
          <View
            style={[
              styles.dropdownMenu,
              {
                top: dropdownPosition.y,
                left: dropdownPosition.x - wp(30),
              },
            ]}
          >
            <Pressable
              style={styles.menuItem}
              onPress={() => handleDropdownAction("edit")}
            >
              <Text style={styles.menuText}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => handleDropdownAction("download")}
            >
              <Text style={styles.menuText}>Download</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => handleDropdownAction("delete")}
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
            value={editedYear}
            items={[
              { label: editedYear, value: editedYear }, // Add current value explicitly as the first item
              ...yearsOption.filter((yr) => yr.value !== editedYear), // Append the rest, excluding the current value
            ]}
            setOpen={setOpenYear}
            setValue={setEditedYear}
            placeholder="Select Year"
            style={styles.dropdownStyle}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            zIndex={2000}
            zIndexInverse={1000}
          />
          <DropDownPicker
            open={openCategory}
            onOpen={onCategoryOpen}
            value={editedCategory}
            items={[
              { label: editedCategory, value: editedCategory }, // Add current value explicitly as the first item
              ...categoriesOption.filter((cat) => cat.value !== editedCategory), // Append the rest, excluding the current value
            ]}
            setOpen={setOpenCategory}
            setValue={setEditedCategory}
            placeholder="Select Category"
            style={styles.dropdownStyle}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            zIndex={2000}
            zIndexInverse={1000}
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
          <Dialog.Button label="Submit" onPress={() => handleEditSubmit()} />
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
            onPress={() => {
              setDeleteDialogVisible(false);
              handleCancelDeleteFile();
            }}
          />
          <Dialog.Button label="Yes" onPress={() => handleDeleteFile()} />
        </Dialog.Container>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  headerContainer: {
    position: "absolute",
    top: hp(2),
    width: wp(100),
    flexDirection: "row",
    paddingHorizontal: wp(5),
    zIndex: 2,
  },
  exitButton: {
    alignSelf: "center",
  },
  threeDots: {
    alignSelf: "center",
    marginLeft: "auto",
  },
  imageName: {
    marginLeft: wp(5),
    color: "#fff",
    fontSize: wp(6),
    alignSelf: "center",
  },
  dropdownMenu: {
    position: "absolute",
    backgroundColor: "#fff",
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
  menuText: {
    fontSize: wp(4),
    color: "#000",
  },
  dropdownStyle: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownContainerStyle: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 3000,
  },
});
