import { Text, View, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BackButtonC from "../components/BackButtonC";

export default function FileScreenTitle({ screenTitleText }) {
  return (
    <View style={styles.screenTitle}>
      <BackButtonC />
      <Text style={styles.screenTitleText}>{screenTitleText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3),
  },
  screenTitleText: {
    fontSize: wp(6),
    marginLeft: wp(4),
  },
});
