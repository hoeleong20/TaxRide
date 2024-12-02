import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NotificationButtonC from "../../components/NotificationButtonC";
import StorageUsageBarC from "../../components/StorageUsageBarC";
import Icon from "react-native-vector-icons/Ionicons";
import FileC from "../../components/FileC";
import ImagePreviewC from "../../components/ImagePreviewC";

const profileImage = require("../../assets/adaptive-icon.png");

export default function HomeScreen() {
  const [name, setName] = useState("Ayush Srivastava");
  const [cloudStoragePerc, setCloudStoragePerc] = useState(37);
  const [internalStoragePerc, setInternalStoragePerc] = useState(66);
  const [imageName, setImageName] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const imageUri =
    // "https://static.vecteezy.com/system/resources/previews/033/540/048/non_2x/two-funny-cats-take-a-selfie-on-the-beach-humor-created-using-artificial-intelligence-free-photo.jpg";
    "https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnVubnklMjBjYXR8ZW58MHx8MHx8fDA%3D";

  const openFile = (imageName) => {
    setModalVisible(true);
    setImageName(imageName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.innerContainer}>
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
              <Text style={styles.StorageUsageText2}>131 GB of 2 TB used</Text>
            </View>
          </View>
          <View style={styles.StorageUsageContainer}>
            <StorageUsageBarC storagePerc={internalStoragePerc} />
            <View style={styles.StorageUsageText}>
              <Text style={styles.StorageUsageText1}>Internal Storage</Text>
              <Text style={styles.StorageUsageText2}>85 GB of 128 GB used</Text>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.titleText}>Recent Files</Text>
            <View style={styles.altContainer}>
              <Text style={styles.altText}>View More</Text>
              <Icon name="arrow-forward-sharp" size={wp(5)} color="#0066FF" />
            </View>
          </View>
          <View>
            <Pressable onPress={() => openFile("Invoice")}>
              <FileC
                fileName={"Invoice"}
                fileDate={"25 Oct 2023"}
                fileSize={2.4}
              />
            </Pressable>
            <Pressable onPress={() => openFile("Camera Images")}>
              <FileC
                fileName={"Camera Images"}
                fileDate={"19 Oct 2023"}
                fileSize={34}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
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
    width: hp(10),
    height: hp(10),
    marginBottom: hp(2),
  },
  profileTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
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
});
