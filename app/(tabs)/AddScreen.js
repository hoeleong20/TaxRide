import { Text, View, StyleSheet, Pressable, SafeAreaView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const logoImg = require("../../assets/taxride_logo.png");

export default function AddScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Add File</Text>

      <View>
        <Pressable onPress={() => console.log("1")} style={styles.rowContainer}>
          <Text>Take Photo</Text>
        </Pressable>
        <Pressable onPress={() => console.log("1")} style={styles.rowContainer}>
          <Text>Choose From Library</Text>
        </Pressable>
        <Pressable onPress={() => console.log("1")} style={styles.rowContainer}>
          <Text>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(7),
    paddingTop: hp(2),
  },
});
