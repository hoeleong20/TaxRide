import { router } from "expo-router";
import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";

export default function FolderC({ folderName, navigateToPath }) {
  return (
    <View>
      <Pressable
        onPress={() => router.push(navigateToPath)}
        style={styles.rowContainer}
      >
        <View>
          <View style={styles.rowStyle}>
            <Icon
              name="folder"
              size={wp(9)}
              style={styles.icon}
              color={"#F6C136"}
            />
            <View style={styles.colStyle}>
              <Text style={styles.folderHeaderText}>{folderName}</Text>
            </View>
          </View>
        </View>
        <Icon name="ellipsis-vertical" size={wp(9)} />
      </Pressable>
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
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  colStyle: {
    flexDirection: "column",
    marginLeft: wp(4),
  },
  folderHeaderText: {
    fontSize: wp(5),
    fontWeight: "500",
  },
});
