import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";

export default function NotificationButtonC() {
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Pressable onPress={() => console.log("1")}>
        <Icon name="notifications-outline" size={wp(9)} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    size: wp(50),
  },
});
