import { router } from "expo-router";
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
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { useState, useEffect, useRef } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

export default function ImagePreviewC({
  modalVisible,
  setModalVisible,
  imageUri,
  imageName,
}) {
  const [aspectRatio, setAspectRatio] = useState(1); // Default aspect ratio
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [headerVisible, setHeaderVisible] = useState(true); // Manage header visibility

  const headerTranslateY = useRef(new Animated.Value(0)).current; // Initial position (hidden above view)

  const showHeaderWithAnimation = () => {
    setHeaderVisible(true); // Ensure it's visible
    Animated.timing(headerTranslateY, {
      toValue: 0, // Slide header into view
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideHeaderWithAnimation = () => {
    Animated.timing(headerTranslateY, {
      toValue: -100, // Slide header up and out of view
      duration: 300,
      useNativeDriver: true,
    }).start(() => setHeaderVisible(false)); // After animation, hide the header
  };

  const toggleHeader = () => {
    if (headerVisible) {
      hideHeaderWithAnimation();
    } else {
      showHeaderWithAnimation();
    }
  };

  const resetHeader = () => {
    setHeaderVisible(true); // Reset state to visible
    headerTranslateY.setValue(0); // Reset animation to visible position
  };

  useEffect(() => {
    if (modalVisible) {
      resetHeader(); // Reset header state when the modal is opened
    }
  }, [modalVisible]);

  const image = [
    {
      // For local images, pass an empty URL and use the `props` key
      url: imageUri,
      props: {
        // source: require("../../../assets/cat.jpg"),
        style: {
          width: screenWidth,
          height: screenWidth / aspectRatio, // Adjust height based on aspect ratio
        },
      },
    },
  ];

  // Fetch image dimensions
  useEffect(() => {
    Image.getSize(
      imageUri,
      (width, height) => {
        setAspectRatio(width / height); // Calculate aspect ratio
        console.log("aspect ratio:", width / height);
      },
      (error) => {
        console.error("Error fetching image size:", error);
      }
    );
  }, [imageUri]);

  const imageViewHeader = () => {
    return (
      <Animated.View
        style={[
          styles.headerContainer,
          { transform: [{ translateY: headerTranslateY }] }, // Apply slide animation
        ]}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.exitButton}
        >
          <Ionicons name="close-sharp" size={wp(8)} color="white" />
        </TouchableOpacity>
        <Text style={styles.imageName}>{imageName}</Text>
        <TouchableOpacity
          onPress={() => console.log("clicked 3 dots")}
          style={styles.threeDots}
        >
          <Entypo name="dots-three-horizontal" size={wp(8)} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Modal visible={modalVisible} transparent={false}>
      <SafeAreaView style={styles.modalBackground}>
        <ImageViewer
          imageUrls={image}
          enableSwipeDown={true}
          saveToLocalByLongPress={false}
          onSwipeDown={() => setModalVisible(false)} // Close on swipe down
          renderHeader={() => imageViewHeader()}
          renderIndicator={() => null} // Hide page indicator
          enableImageZoom={true} // Allow zoom
          renderImage={(props) => (
            <View>
              <Image
                {...props}
                resizeMode="contain" // Fit image within the container
              />
            </View>
          )}
          onClick={toggleHeader}
        />
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
    top: hp(2), // Adjust for status bar or notch
    width: wp(100),
    zIndex: 2,
    flexDirection: "row",
    paddingHorizontal: wp(7),
  },
  exitButton: {
    alignSelf: "center",
  },
  threeDots: {
    alignSelf: "center",
    marginLeft: "auto",
    marginRight: 0,
  },
  imageName: {
    marginLeft: wp(5),
    color: "#fff",
    fontSize: wp(7),
    alignSelf: "center",
  },
});
