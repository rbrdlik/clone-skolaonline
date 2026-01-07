import { Stack, usePathname } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import BottomNav from "./components/BottomNav";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
import { Stack } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import BottomNav from "./components/BottomNav";
import { AuthProvider, useAuth } from "./context/AuthContext";

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C8DEF" />
      </View>
    );
  }

  const showBottomNav = isAuthenticated && pathname !== "/" && pathname !== "/index";

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="rozvrh" />
          <Stack.Screen name="lesson-detail" />
          <Stack.Screen name="znamky" />
          <Stack.Screen name="subject-detail" />
          <Stack.Screen name="grade-detail" />
          <Stack.Screen name="messages" />
          <Stack.Screen name="message-detail" />
        </Stack>
      </View>

      {showBottomNav && <BottomNav />}
      {/* Zobrazit navigaci pouze pokud je uživatel přihlášen */}
      {isAuthenticated && <BottomNav />}
    </View>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <RootLayoutNav />
      </NotificationsProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
