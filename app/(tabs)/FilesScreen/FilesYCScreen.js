import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FileC from "../../../components/FileC";
import FileScreenTitleC from "../../../components/FileScreenTitleC";
import ImagePreviewC from "../../../components/ImagePreviewC";

const logoImg = require("../../../assets/adaptive-icon.png");

export default function FilesYCScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageName, setImageName] = useState("");

  const imageUri =
    "https://static.vecteezy.com/system/resources/previews/033/540/048/non_2x/two-funny-cats-take-a-selfie-on-the-beach-humor-created-using-artificial-intelligence-free-photo.jpg";
  // "https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnVubnklMjBjYXR8ZW58MHx8MHx8fDA%3D";

  const openFile = (imageName) => {
    setModalVisible(true);
    setImageName(imageName);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <FileScreenTitleC screenTitleText={"Lifestyle"} />
        <View>
          <Pressable onPress={() => openFile("Invoice")}>
            <FileC
              fileName={"Invoice"}
              fileDate={"25 Oct 2023"}
              fileSize={2.4}
            />
          </Pressable>
          <Pressable onPress={() => openFile("Picture")}>
            <FileC
              fileName={"Picture"}
              fileDate={"25 Oct 2023"}
              fileSize={2.4}
            />
          </Pressable>
        </View>
      </View>

      <ImagePreviewC
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        imageUri={imageUri}
        imageName={imageName}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: StatusBar.currentHeight,
  },
});
