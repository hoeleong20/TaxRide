import { useCallback, useEffect, useState } from "react";
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

export default function TabBarC({ state, descriptors, navigation }) {
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
    if (cameraStatus) {
      if (
        cameraStatus.status === ImagePicker.PermissionStatus.UNDETERMINED ||
        (cameraStatus.status === ImagePicker.PermissionStatus.DENIED &&
          cameraStatus.canAskAgain)
      ) {
        const permission = await requestCameraPermission();
        if (permission.granted) {
          await handleLaunchImageLibrary();
        }
      } else if (cameraStatus.status === ImagePicker.PermissionStatus.DENIED) {
        console.log("2");
        const permission = await requestCameraPermission();
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

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      alert("error : " + error.message);
    }
  }, []);

  const handleLaunchImageLibrary = async () => {
    console.log("1");
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ["images", "videos"],
        // allowsEditing: true,
        // aspect: [4, 3],
        // quality: 1,
      });
      console.log("2");

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      alert("error : " + error.message);
    }
  };

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
