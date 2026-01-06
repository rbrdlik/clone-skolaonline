import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
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

  // Development mode - tlačítko pro přeskočení přihlášení
  const handleSkipLogin = () => {
    // Mock přihlášení pro development
    const mockUser = {
      id: 'dev-user-1',
      username: 'teststudent',
      studentId: 'student-1',
      name: 'Test Student',
      class: '1A1',
    };
    
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
        {/* Logo/Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Škola Online</Text>
          <Text style={styles.subtitle}>Přihlaste se do svého účtu</Text>
          {__DEV__ && (
            <Text style={styles.devNote}>
              Development Mode: Můžete přeskočit přihlášení
            </Text>
          )}
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Uživatelské jméno</Text>
            <TextInput
              style={styles.input}
              placeholder="Zadejte uživatelské jméno"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Heslo</Text>
            <TextInput
              style={styles.input}
              placeholder="Zadejte heslo"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
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
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#4C8DEF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  devNote: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  loginButton: {
    height: 50,
    backgroundColor: "#4C8DEF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
