import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter, usePathname, useSegments, Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

const NAV_WIDTH_PERCENT = 0.75;
const ITEM_COUNT = 3;

export default function BottomNav() {
  const pathname = usePathname();
  const segments = useSegments();
  const translateX = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get("window").width;
  const navWidth = screenWidth * NAV_WIDTH_PERCENT;
  const itemWidth = navWidth / ITEM_COUNT;

  const getIndexFromPath = () => {
    const currentPath = pathname || segments.join("/") || "/";
    if (currentPath === "/Messages" || currentPath?.startsWith("/Messages")) return 0;
    if (currentPath === "/rozvrh" || currentPath?.startsWith("/rozvrh")) return 1;
    if (currentPath === "/znamky" || currentPath?.startsWith("/znamky")) return 2;
    return 1;
  };

  useEffect(() => {
    const index = getIndexFromPath();
    Animated.spring(translateX, {
      toValue: index * itemWidth,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [pathname, itemWidth]);

  return (
    <View style={styles.navWrapper}>
      <View style={[styles.navBar, { width: navWidth }]}>
        <Animated.View
          style={[
            styles.indicator,
            {
              width: itemWidth * 0.85,
              marginLeft: itemWidth * 0.075,
              transform: [{ translateX }],
            },
          ]}
        />

        <NavItem href="/Messages" iconName="chatbubble" />
        <NavItem href="/rozvrh" iconName="calendar" />
        <NavItem href="/znamky" iconName="star" />
      </View>
    </View>
  );
}

function NavItem({ href, iconName }) {
  const pathname = usePathname();
  const segments = useSegments();
  
  const currentPath = pathname || segments.join("/") || "/";
  const isActive = currentPath === href || 
                   (href !== '/' && currentPath?.startsWith(href));

  return (
    <Link href={href} asChild>
      <TouchableOpacity 
        style={styles.navItem}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={iconName} 
          size={24} 
          color={isActive ? "#ffffff" : "#000000"} 
        />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    elevation: 100,
  },

  navBar: {
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    // Android shadow
    elevation: 8,
  },

  indicator: {
    position: "absolute",
    left: 0,
    top: 1,
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
    height: "100%",
    zIndex: 10,
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  icon: {
    fontSize: 22,
  },
});
