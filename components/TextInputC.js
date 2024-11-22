import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function TextInputC({ placeholderText, value, onChangeText }) {
  return (
    <View onPress={() => console.log("1")} style={styles.TextInputContainer}>
      <TextInput
        placeholder={placeholderText}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  TextInputContainer: {
    height: hp(7),
    width: "100%",
    marginHorizontal: "auto",
    marginVertical: hp(1),
    justifyContent: "center",
    borderRadius: hp(1),
    borderWidth: hp(0.1),
    backgroundColor: "#F7F8F9",
    borderColor: "#E8ECF4",
    paddingLeft: wp(5),
  },
  text: {
    fontWeight: "200",
    fontSize: hp(2),
  },
});
