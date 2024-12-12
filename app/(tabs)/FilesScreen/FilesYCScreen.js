import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FileC from "../../../components/FileC";
import FileScreenTitleC from "../../../components/FileScreenTitleC";
import ImagePreviewC from "../../../components/ImagePreviewC";

export default function FilesYCScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageName, setImageName] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://192.168.1.39:3000/google/files");
        const data = await response.json();

        if (data.files) {
          console.log("Fetched files:", data.files); // Log files to inspect
          setFiles(data.files);
        } else {
          Alert.alert("No files found in the folder.");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        Alert.alert("Error fetching files.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    if (!imageUri) {
      // Suppress logs for uninitialized URIs
      return;
    }
    console.log("Image URI: ", imageUri);
  }, [imageUri]);

  const openFile = (fileName, fileUri) => {
    if (!fileUri || !fileUri.startsWith("https://")) {
      console.error("Invalid image URI provided: ", fileUri);
      Alert.alert("Invalid or inaccessible file URI.");
      return;
    }
    console.log("Opening image with URI: ", fileUri); // Debug the URI being opened
    setModalVisible(true);
    setImageName(fileName);
    setImageUri(fileUri); // Pass the correct viewable link
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <FileScreenTitleC screenTitleText={"TaxRide Images"} />
        <View>
          {files.map((file) => (
            <Pressable
              key={file.id}
              onPress={() => openFile(file.name, file.directLink)}
            >
              <FileC
                fileName={file.name}
                fileDate={"--"} // Replace with date if available in the response
                fileSize={2.4} // Replace with actual file size if available
              />
            </Pressable>
          ))}
        </View>
      </View>

      {imageUri && imageUri.startsWith("https://") && (
        <ImagePreviewC
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          imageUri={imageUri}
          imageName={imageName}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: StatusBar.currentHeight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
