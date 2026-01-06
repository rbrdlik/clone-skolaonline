import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Link, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

const NAV_WIDTH_PERCENT = 0.75;
const ITEM_COUNT = 3;

export default function BottomNav() {
  const pathname = usePathname();
  const translateX = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get("window").width;
  const navWidth = screenWidth * NAV_WIDTH_PERCENT;
  const itemWidth = navWidth / ITEM_COUNT;

  const getIndexFromPath = () => {
    if (pathname === "/messages") return 0;
    if (pathname === "/") return 1;
    if (pathname === "/grades") return 2;
    return 1;
  };

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: getIndexFromPath() * itemWidth,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [pathname]);

  return (
    <View style={styles.navWrapper}>
      <View style={[styles.navBar, { width: navWidth }]}>
        <Animated.View
          style={[
            styles.indicator,
            {
              width: itemWidth,
              transform: [{ translateX }],
            },
          ]}
        />

        <NavItem href="/messages" iconName="chatbubble" />
        <NavItem href="/" iconName="calendar" />
        <NavItem href="/grades" iconName="star" />
      </View>
    </View>
  );
}

function NavItem({ href, iconName }) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name={iconName} size={24} color="black" />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    zIndex: 100,
    elevation: 100,
  },

  navBar: {
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 35,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
    elevation: 8,
  },

  indicator: {
    position: "absolute",
    height: 50,
    margin: 10,
    borderRadius: 25,
    backgroundColor: "#7d8aff",
    zIndex: 0,
    pointerEvents: "none",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  icon: {
    fontSize: 22,
  },
});
