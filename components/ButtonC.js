import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Link, router } from "expo-router";

export default function ButtonC({
  textContent,
  buttonStyle,
  textStyle,
  onPress
}) {
  return (
    <Pressable
      style={[styles.button, buttonStyle]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{textContent}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: hp(7),
    justifyContent: "center",
    borderRadius: hp(1),
    borderWidth: hp(0.2),
    width: "100%",
  },
  text: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: hp(2.5),
  },
});
