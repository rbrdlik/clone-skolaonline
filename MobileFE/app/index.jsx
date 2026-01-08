import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter, useSegments } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Pokud je uživatel přihlášen, přesměruj na rozvrh
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/rozvrh");
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Chyba", "Prosím vyplňte všechna pole");
      return;
    }

    setLoading(true);
    try {
      const result = await login(username.trim(), password);
      
      if (result.success) {
        // Přesměrování na hlavní stránku (rozvrh)
        router.replace("/rozvrh");
      } else {
        Alert.alert(
          "Chyba přihlášení", 
          result.error || "Nesprávné přihlašovací údaje.\n\nUjistěte se, že:\n• Backend je spuštěný\n• API URL je správně nastavená\n• Máte platné přihlašovací údaje"
        );
      }
    } catch (error) {
      Alert.alert(
        "Chyba připojení", 
        `Nastala chyba při připojování k serveru.\n\n${error.message}\n\nZkontrolujte:\n• Je backend spuštěný?\n• Je API URL správně nastavená v app/config/api.js?\n• Funguje síťové připojení?`
      );
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipLogin = () => {
    login('dev', 'dev').then(() => {
  // Development mode - tlačítko pro přeskočení přihlášení
  const handleSkipLogin = () => {
    // Simulace úspěšného přihlášení
    login('dev', 'dev').then(() => {
      // Pokud login selže (backend není dostupný), použijeme mock data
      setTimeout(() => {
        router.replace("/rozvrh");
      }, 100);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={require("./assets/icon.png")} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>MojeŠkola</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={22} color="#000000" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Zadejte přihlašovací jméno..."
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={22} color="#000000" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Zadejte heslo..."
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Přihlásit se</Text>
            )}
          </TouchableOpacity>

          {/* Development mode - tlačítko pro přeskočení */}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipLogin}
              disabled={loading}
            >
              <Text style={styles.skipButtonText}>
                ⚡ Přeskočit přihlášení (Dev Mode)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
    width: "100%",
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: -40,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4C8DEF",
    paddingHorizontal: 30,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  loginButton: {
    height: 50,
    backgroundColor: "#4C8DEF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    marginTop: 15,
    padding: 12,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#4C8DEF",
    fontSize: 14,
    fontWeight: "500",
  },
});
