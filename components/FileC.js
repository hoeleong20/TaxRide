import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";

export default function FileC({ fileName, fileDate, fileSize }) {
  return (
    <View>
      <View style={styles.rowContainer}>
        <View>
          <View style={styles.rowStyle}>
            <Icon name="document" size={wp(9)} />
            <View style={styles.colStyle}>
              <Text style={styles.fileHeaderText}>{fileName}</Text>
              <Text style={styles.fileAltText}>
                {fileDate} | {fileSize}
              </Text>
            </View>
          </View>
        </View>
        <Icon name="ellipsis-vertical" size={wp(9)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: wp(4),
    borderColor: "black",
    borderWidth: wp(0.1),
    marginHorizontal: wp(3),
    marginVertical: hp(1.5),
    borderRadius: wp(6),
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  colStyle: {
    flexDirection: "column",
    marginLeft: wp(4),
  },
  fileHeaderText: {
    fontSize: wp(5),
    fontWeight: "500",
  },
  fileAltText: {
    fontSize: wp(4),
    color: "#A6A6A6",
  },
});
