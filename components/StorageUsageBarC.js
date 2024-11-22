import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function StorageUsageBarC({ storagePerc }) {
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <AnimatedCircularProgress
        size={wp(20)}
        width={wp(4)}
        fill={storagePerc}
        rotation={0}
        tintColor="#0A7BCC"
        onAnimationComplete={() => console.log("onAnimationComplete")}
        backgroundColor="#D8EDFD"
        lineCap="round"
        backgroundWidth={wp(4)}
      >
        {() => <Text style={styles.storagePercText}>{storagePerc}%</Text>}
      </AnimatedCircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  storagePercText: {
    fontSize: wp(4),
    fontWeight: "600",
  },
});
