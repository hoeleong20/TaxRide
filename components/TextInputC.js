import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

export default function TextInputC({
  placeholderText,
  value,
  onChangeText,
  secureTextEntry = false, // Add secureTextEntry as a default prop
  includeEyeIcon = false, // Add a prop to decide whether to include the eye icon
  ...otherProps
}) {
  const [isMasked, setIsMasked] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsMasked(!isMasked);
  };
  return (
    <View style={styles.TextInputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholderText}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isMasked} // Use isMasked for secureTextEntry
        {...otherProps}
      />
      {includeEyeIcon && (
        <Pressable style={styles.eyeIcon} onPress={togglePasswordVisibility}>
          <Icon
            name={isMasked ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="black"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  TextInputContainer: {
    height: hp(7),
    marginVertical: hp(1),
    justifyContent: "center",
    borderRadius: hp(1),
    borderWidth: hp(0.1),
    backgroundColor: "#F7F8F9",
    borderColor: "#E8ECF4",
    paddingHorizontal: wp(5),
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
  },
  eyeIcon: {},
});
