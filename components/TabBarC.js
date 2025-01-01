import { useCallback, useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Parse from "parse/react-native.js";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import Dialog from "react-native-dialog";
import DropDownPicker from "react-native-dropdown-picker";

import { BASE_URL } from "@env";
import { FilesContext } from "../app/FilesContext";

export default function TabBarC({ state, descriptors, navigation }) {
  const { refreshFiles } = useContext(FilesContext);

  const [years, setYears] = useState([]);
  const [categories, setCategories] = useState([]);

  const [openYear, setOpenYear] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  useEffect(() => {
    // Fetch years
    axios.get(`${BASE_URL}/years`).then((response) => {
      setYears(response.data);
    });

    // Fetch categories
    axios.get(`${BASE_URL}/categories`).then((response) => {
      setCategories(response.data);
    });
  }, []);

  const icons = {
    HomeScreen: (props) => (
      <Icon name="house-chimney" size={wp(6)} style={styles.icon} {...props} />
    ),
    FilesScreen: (props) => (
      <Icon name="folder-open" size={wp(6)} style={styles.icon} {...props} />
    ),
    AddScreen: (props) => (
      <LinearGradient
        style={styles.addIconButton}
        colors={["#9D79FF", "#7747FD"]}
        locations={[0.14, 0.91]}
      >
        <Icon name="plus" size={wp(6)} color={"#FFFFFF"} />
      </LinearGradient>
    ),
  };

  const { showActionSheetWithOptions } = useActionSheet();

  const handleAddAction = () => {
    const title = "Select a Photo";
    const options = ["Take Photo ...", "Choose From Library ...", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log("Take Photo selected");
          handleCameraPermission();
        } else if (buttonIndex === 1) {
          console.log("Choose From Library selected");
          handleGalleryPermission();
        }
      }
    );
  };

  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const [galleryStatus, requestGalleryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const handleCameraPermission = useCallback(async () => {
    if (cameraStatus) {
      if (
        cameraStatus.status === ImagePicker.PermissionStatus.UNDETERMINED ||
        (cameraStatus.status === ImagePicker.PermissionStatus.DENIED &&
          cameraStatus.canAskAgain)
      ) {
        const permission = await requestCameraPermission();
        if (permission.granted) {
          await handleLaunchCamera();
        }
      } else if (cameraStatus.status === ImagePicker.PermissionStatus.DENIED) {
        console.log("2");
        const permission = await requestCameraPermission();
        if (permission.granted) {
          console.log("3");
          await handleLaunchCamera();
        }
        await Linking.openSettings();
      } else {
        await handleLaunchCamera();
      }
    }
  }, [cameraStatus, handleLaunchCamera, requestCameraPermission]);

  const handleGalleryPermission = useCallback(async () => {
    if (galleryStatus) {
      if (
        galleryStatus.status === ImagePicker.PermissionStatus.UNDETERMINED ||
        (galleryStatus.status === ImagePicker.PermissionStatus.DENIED &&
          galleryStatus.canAskAgain)
      ) {
        const permission = await requestGalleryPermission();
        if (permission.granted) {
          await handleLaunchImageLibrary();
        }
      } else if (galleryStatus.status === ImagePicker.PermissionStatus.DENIED) {
        console.log("2");
        const permission = await requestGalleryPermission();
        if (permission.granted) {
          console.log("3");
          await handleLaunchImageLibrary();
        }
        await Linking.openSettings();
      } else {
        await handleLaunchImageLibrary();
      }
    }
  }, [galleryStatus, handleLaunchImageLibrary, requestGalleryPermission]);

  const [image, setImage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [filename, setFilename] = useState("");

  const handleLaunchCamera = useCallback(async () => {
    console.log("1");
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        // mediaTypes: ["images", "videos"],
        // allowsEditing: true,
        // aspect: [4, 3],
        // quality: 1,
      });
      console.log("2");
      // saveFile();

      // AsyncStorage.setItem("savedImage", JSON.stringify(result));
      // const jsonValue = await AsyncStorage.getItem("savedImage");
      // console.log(JSON.parse(jsonValue));

      if (!result.canceled) {
        console.log(result.assets[0]?.uri);
        saveImage(result.assets[0]?.uri);
        setImage(result.assets[0].uri);
        setDialogVisible(true); // Show dialog after selecting image
      }
    } catch (error) {
      alert("error : " + error.message);
    }
  }, []);

  // const handleLaunchImageLibrary = async () => {
  //   console.log("1");
  //   try {
  //     // No permissions request is necessary for launching the image library
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       // mediaTypes: ["images", "videos"],
  //       // allowsEditing: true,
  //       // aspect: [4, 3],
  //       // quality: 1,
  //     });
  //     console.log("2");

  //     if (!result.canceled) {
  //       console.log(result.assets[0]?.uri);
  //       saveImage(result.assets[0]?.uri);
  //       setImage(result.assets[0].uri);
  //       console.log("Set image state with:", result.assets[0]?.uri);

  //       setDialogVisible(true); // Show dialog after selecting image
  //     }
  //   } catch (error) {
  //     alert("error : " + error.message);
  //   }
  // };

  const handleLaunchImageLibrary = async () => {
    console.log("Choose From Library selected");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      if (!result.canceled) {
        const uri = result.assets[0]?.uri;
        console.log("Selected image URI:", uri);

        saveImage(uri);
        setImage(uri); // Update state
        setDialogVisible(true); // Show dialog
      }
    } catch (error) {
      console.error("Error in handleLaunchImageLibrary:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // useEffect(() => {
  //   console.log("Image changed:", image);
  //   if (image) {
  //     console.log("Dialog visibility set to true");
  //     uploadImage();
  //     // setDialogVisible(true);
  //   }
  // }, [image]);

  useEffect(() => {
    console.log("Updated image state:", image);
  }, [image]);

  useEffect(() => {
    console.log("Dialog visibility changed:", dialogVisible);
  }, [dialogVisible]);

  async function saveFile() {
    console.log("run save file");

    // 1. Create a file
    const { base64, fileName } = image;
    const parseFile = new Parse.File(fileName, { base64 });

    // 2. Save the file
    try {
      const responseFile = await parseFile.save();
      const Gallery = Parse.Object.extend("Gallery");
      const gallery = new Gallery();
      gallery.set("picture", responseFile);

      await gallery.save();
      Alert.alert("The file has been saved to Back4app.");
    } catch (error) {
      console.log(
        "The file either could not be read, or could not be saved to Back4app."
      );
    }
  }

  const saveImage = async (imageUri) => {
    if (!imageUri) {
      console.error("Error: imageUri is null or undefined");
      return;
    }
    console.log("Image URI:", imageUri); // Log the URI
    const fileName = `my-image-${Date.now()}.png`;
    const destinationPath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.copyAsync({
        from: imageUri,
        to: destinationPath,
      });
      console.log("Image saved to:", destinationPath);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  // const handleLaunchCamera = async () => {
  //   try {
  //     const result = await ImagePicker.launchCameraAsync();
  //     if (!result.canceled) {
  //       await uploadToGoogleDrive(result.assets[0].uri);
  //     }
  //   } catch (error) {
  //     console.error("Error launching camera:", error);
  //     Alert.alert("Error", "Failed to launch camera.");
  //   }
  // };

  // const handleLaunchImageLibrary = async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync();
  //     if (!result.canceled) {
  //       await uploadToGoogleDrive(result.assets[0].uri);
  //     }
  //   } catch (error) {
  //     console.error("Error launching image library:", error);
  //     Alert.alert("Error", "Failed to open image library.");
  //   }
  // };

  // const uploadToGoogleDrive = async (fileUri) => {
  //   try {
  //     const tokens = await AsyncStorage.getItem("googleDriveTokens");

  //     if (!tokens) {
  //       Alert.alert("Error", "Please connect to Google Drive first.");
  //       return;
  //     }

  //     const fileName = `my-image-${Date.now()}.png`;
  //     const fileType = "image/png";
  //     const fileBuffer = await FileSystem.readAsStringAsync(fileUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     const formData = new FormData();
  //     formData.append("file", {
  //       uri: fileUri,
  //       name: fileName,
  //       type: fileType,
  //     });
  //     formData.append("token", tokens);

  //     const response = await fetch(`${BASE_URL}/google/upload`, {
  //       method: "POST",
  //       body: formData,
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (response.ok) {
  //       Alert.alert("Success", "File uploaded to Google Drive!");
  //     } else {
  //       const error = await response.text();
  //       Alert.alert("Error", `File upload failed: ${error}`);
  //     }
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     Alert.alert("Error", "Failed to upload file. Please try again.");
  //   }
  // };

  // const uploadImage = async () => {
  //   console.log("13");
  //   if (!image) return;
  //   console.log("14");

  //   const formData = new FormData();
  //   formData.append("file", {
  //     uri: image,
  //     name: `${year}-${category}-${filename}.jpg`,
  //     type: "image/jpeg",
  //   });
  //   console.log("15");

  //   try {
  //     const response = await axios.post(`${BASE_URL}/upload`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     alert(`File uploaded successfully. File ID: ${response.data.fileId}`);
  //     setImage("");
  //     setYear("");
  //     setCategory("");
  //     setFilename("");
  //     setDialogVisible(false);
  //   } catch (error) {
  //     alert(`Upload failed: ${error.message}`);
  //     console.error(
  //       "Upload Error Details:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  const handleDialogSubmit = useCallback(() => {
    // Close dialog and trigger the upload function
    setDialogVisible(false);

    // Proceed with the upload
    uploadImage();
    console.log("b");

    // Reset the states to avoid lingering issues
    setImage("");
    setYear("");
    setCategory("");
    setFilename("");
  }, [uploadImage]);

  const uploadImage = useCallback(async () => {
    console.log("Image URI before upload:", image);
    try {
      console.log("Uploading Image");
      if (!image) {
        console.error("No image found, exiting upload.");
        return;
      }
      console.log("Image state before upload:", image);

      const formData = new FormData();
      formData.append("file", {
        uri: image,
        name: `${year}-${category}-${filename}.jpg`,
        type: "image/jpeg",
      });

      console.log("FormData prepared:", formData);

      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response received:", response);
      alert(`File uploaded successfully. File ID: ${response.data.fileId}`);
      await refreshFiles();

      // Reset states only after successful upload
      setImage("");
      setYear("");
      setCategory("");
      setFilename("");
    } catch (error) {
      console.error("Error in uploadImage:", error);
      alert(`Upload failed: ${error.message}`);
    }
  }, [image, year, category, filename]); // Ensure dependencies are correct

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        // const onPress = () => {
        //   const event = navigation.emit({
        //     type: "tabPress",
        //     target: route.key,
        //     canPreventDefault: true,
        //   });

        //   if (!isFocused && !event.defaultPrevented) {
        //     navigation.navigate(route.name, route.params);
        //   }
        // };

        const onPress = () => {
          if (route.name === "AddScreen") {
            handleAddAction();
          } else {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key} // Add this to resolve the warning
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {icons[route.name]({
              color: isFocused ? "#0066FF" : "#CCCCCC",
            })}

            <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
              {label}
            </Text>
            {/* Dialog for Year and Category */}
            <Dialog.Container visible={dialogVisible}>
              <Dialog.Title>Document Details</Dialog.Title>
              {/* <Dialog.Input
                placeholder="Year"
                value={year}
                onChangeText={setYear}
              />
              <Dialog.Input
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
              /> */}

              {/* Dropdown for Year */}
              <DropDownPicker
                open={openYear}
                value={year}
                items={years}
                setOpen={setOpenYear}
                setValue={setYear}
                setItems={setYears}
                placeholder="Select a Year"
                listMode="SCROLLVIEW" // Enable ScrollView for dropdown options
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

              {/* Dropdown for Category */}
              <DropDownPicker
                open={openCategory}
                value={category}
                items={categories}
                setOpen={setOpenCategory}
                setValue={setCategory}
                setItems={setCategories}
                placeholder="Select a Category"
                listMode="SCROLLVIEW" // Enable ScrollView for dropdown options
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
                value={filename}
                onChangeText={setFilename}
              />
              <Dialog.Button
                label="Cancel"
                onPress={() => {
                  console.log("Dialog canceled");
                  setDialogVisible(false);
                  setImage(""); // Clear image on cancel
                  setYear("");
                  setCategory("");
                  setFilename("");
                }}
              />
              <Dialog.Button
                label="Upload"
                onPress={async () => {
                  console.log("Dialog 'Upload' button pressed");
                  setDialogVisible(false);
                  await uploadImage(); // Await upload to avoid conflicts
                }}
              />
            </Dialog.Container>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(9),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(17),
    backgroundColor: "#FFFFFF",
    borderTopWidth: wp(0.1),
    zIndex: 1,
  },
  tabBarItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  addIconButton: {
    position: "absolute",
    zIndex: 3,
    width: wp(20),
    height: wp(20),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
    borderColor: "#C3E8FA",
    borderWidth: wp(2),
    // backgroundColor: "#885DFE",
    bottom: hp(4),
  },
});
