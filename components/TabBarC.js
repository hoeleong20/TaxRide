import { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";

// export default function TabBarC() {
//   const [iconColor, setIconColor] = useState("#CCCCCC");
//   return (
//     <View style={styles.container}>
//       <Pressable onPress={() => console.log("1")}>
//         <Icon name="home" size={wp(7)} style={styles.icon} color={iconColor} />
//         <Text>Home</Text>
//       </Pressable>
//       <Pressable onPress={() => console.log("1")} style={styles.addIconButton}>
//         <Icon name="add" size={wp(7)} style={styles.addIcon} color="white" />
//       </Pressable>
//       <Pressable onPress={() => console.log("1")}>
//         <Icon
//           name="folder"
//           size={wp(7)}
//           style={styles.icon}
//           color={iconColor}
//         />
//         <Text>Files</Text>
//       </Pressable>
//     </View>
//   );
// }

export default function TabBarC({ state, descriptors, navigation }) {
  const icons = {
    HomeScreen: (props) => (
      <Icon name="house-chimney" size={wp(6)} style={styles.icon} {...props} />
    ),
    FilesScreen: (props) => (
      <Icon name="folder-open" size={wp(6)} style={styles.icon} {...props} />
    ),
    AddScreen: (props) => (
      <LinearGradient
        style={styles.addIconButton}
        colors={["#9D79FF", "#7747FD"]}
        locations={[0.14, 0.91]}
      >
        <Icon name="plus" size={wp(6)} color={"#FFFFFF"} />
      </LinearGradient>
    ),
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key} // Add this to resolve the warning
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {icons[route.name]({
              color: isFocused ? "#0066FF" : "#CCCCCC",
            })}

            <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(9),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(17),
    backgroundColor: "#FFFFFF",
    borderTopWidth: wp(0.1),
    zIndex: 1,
  },
  tabBarItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  addIconButton: {
    position: "absolute",
    zIndex: 3,
    width: wp(20),
    height: wp(20),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
    borderColor: "#C3E8FA",
    borderWidth: wp(2),
    // backgroundColor: "#885DFE",
    bottom: hp(4),
  },
});
