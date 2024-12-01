import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FileC from "../../../components/FileC";
import FileScreenTitleC from "../../../components/FileScreenTitleC";
import ImageViewer from "react-native-image-zoom-viewer";
import { Modal } from "react-native";

const logoImg = require("../../../assets/adaptive-icon.png");

export default function FilesYCScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const images = [
    {
      // For local images, pass an empty URL and use the `props` key
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjSKoyOjhKTNOkbuXv8zhtxMwtpt39UaMmLA&s",
    },
    {
      // For local images, pass an empty URL and use the `props` key
      url: "",
      props: {
        source: require("../../../assets/cat.jpg"),
      },
    },
    {
      // For local images, pass an empty URL and use the `props` key
      url: "",
      props: {
        source: require("../../../assets/cat2.jpg"),
      },
    },
  ];

  return (
    <View style={styles.container}>
      <FileScreenTitleC screenTitleText={"Lifestyle"} />
      <View>
        <Pressable onPress={() => setModalVisible(true)}>
          <FileC fileName={"Invoice"} fileDate={"25 Oct 2023"} fileSize={2.4} />
        </Pressable>
        <Pressable onPress={() => setModalVisible(true)}>
          <FileC fileName={"Invoice"} fileDate={"25 Oct 2023"} fileSize={2.4} />
        </Pressable>
      </View>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalBackground}>
          <ImageViewer
            imageUrls={images}
            enableSwipeDown={true}
            onSwipeDown={() => setModalVisible(false)} // Close on swipe down
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: hp(7),
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0,1)", // Semi-transparent black background
    justifyContent: "center",
  },
  screenTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3),
  },
  screenTitleText: {
    fontSize: wp(6),
    marginLeft: wp(4),
  },
  logoContainer: {
    alignItems: "center",
  },
  logoImgStyle: {
    width: hp(30),
    height: hp(30),
    margin: hp(2),
  },
  titleText: {
    fontSize: hp(3),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: hp(3),
  },
  descText: {
    textAlign: "center",
    marginTop: hp(2),
    marginBottom: hp(4),
    color: "#8391A1",
  },
  loginButton: {
    backgroundColor: "#3E33D9",
    borderColor: "#3E33D9",
    marginBottom: hp(2),
  },
  loginText: {
    color: "white",
  },
  altContainer: {
    flexDirection: "row",
    marginHorizontal: "auto",
  },
  altText1: {
    marginRight: wp(2),
  },
  altText2: {
    color: "#3E33D9",
    fontWeight: "600",
  },
});
