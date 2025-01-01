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
} from "react-native";
import { useState, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NotificationButtonC from "../../components/NotificationButtonC";
import StorageUsageBarC from "../../components/StorageUsageBarC";
import Icon from "react-native-vector-icons/Ionicons";
import FileC from "../../components/FileC";
import ImagePreviewC from "../../components/ImagePreviewC";
import ButtonC from "../../components/ButtonC";
import * as Linking from "expo-linking";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

const profileImage = require("../../assets/userProfile.jpg");
// const BASE_URL = "http://192.168.1.39:3000";
import { BASE_URL } from "@env";
import axios from "axios";

export default function HomeScreen() {
  const [name, setName] = useState("Ayush Srivastava");
  const [cloudStoragePerc, setCloudStoragePerc] = useState(37);
  const [internalStoragePerc, setInternalStoragePerc] = useState(66);
  const [imageName, setImageName] = useState("");
  const [recentFiles, setRecentFiles] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");

  const openFile = (imageName, fileUri) => {
    setModalVisible(true);
    setImageName(imageName);
    setImageUri(fileUri);
  };

  // Extract filename without year and category
  const extractFileName = (fullName) => {
    const parts = fullName.split("-");
    return parts.slice(2).join("-"); // Skip the year and category
  };

  // Fetch recent files
  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/files`);
        const files = response.data;

        // Sort files by modified time in descending order
        const sortedFiles = files.sort(
          (a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime)
        );

        // Take the top two most recent files
        setRecentFiles(sortedFiles.slice(0, 2));
      } catch (error) {
        console.error("Error fetching recent files:", error);
        Alert.alert("Error", "Failed to load recent files.");
      }
    };

    fetchRecentFiles();
  }, []);

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
            {recentFiles.map((file) => (
              <Pressable
                key={file.id}
                onPress={() =>
                  openFile(extractFileName(file.name), file.directLink)
                }
              >
                <FileC
                  fileName={extractFileName(file.name)}
                  fileDate={new Date(file.modifiedTime).toLocaleDateString(
                    "en-GB",
                    { day: "2-digit", month: "short", year: "numeric" }
                  )}
                  fileSize={`${Math.round(file.size / 1024)} KB`} // Convert size to KB
                />
              </Pressable>
            ))}
          </View>
        </View>
        {imageUri && (
          <ImagePreviewC
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            imageUri={imageUri}
            imageName={imageName}
          />
        )}
      </ScrollView>
      {/* <ButtonC
        textContent="Login with Google"
        buttonStyle={styles.googleLoginButton}
        textStyle={styles.googleLoginText}
        onPress={handleGoogleAuth}
      /> */}
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
});
