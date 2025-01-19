import { View, StyleSheet, Pressable, Alert } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";

export default function NotificationButtonC() {
  const handleNotificationPress = () => {
    Alert.alert("Notification", "No notifications available for now.");
  };

  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Pressable onPress={handleNotificationPress}>
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
