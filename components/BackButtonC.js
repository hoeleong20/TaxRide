import { router } from "expo-router";
import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";

export default function BackButtonC({ border }) {
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Pressable
        onPress={() => router.back()}
        style={border === true ? styles.button : null}
      >
        <Icon name="chevron-back-outline" size={wp(9)} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: wp(0.5),
    borderRadius: wp(5),
    borderColor: "#E8ECF4",
    padding: wp(2),
  },
  icon: {
    size: wp(50),
  },
});
