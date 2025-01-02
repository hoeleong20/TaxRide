import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import { useState, useRef } from "react";

export default function FileC({ fileName, fileDate, fileSize, onMenuPress }) {
  const pressableRef = useRef(null);

  const handlePress = () => {
    if (pressableRef.current) {
      pressableRef.current.measure((fx, fy, width, height, px, py) => {
        onMenuPress(px - wp(20), py + height); // Pass absolute x, y position for dropdown
      });
    }
  };

  return (
    <View style={styles.container}>
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
        <Pressable ref={pressableRef} onPress={handlePress}>
          <Icon name="ellipsis-vertical" size={wp(9)} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative", // Ensure dropdown aligns relative to the parent
  },
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
