import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header({ title, showBack = false, showProfile = false }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleProfilePress = () => {
    if (showProfile) {
      setModalVisible(true);
    }
  };

  const handleLogout = async () => {
    setModalVisible(false);
    await logout();
    router.replace("/");
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "?";
  };

  return (
    <>
      <View style={styles.header}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
        
        <Text style={styles.title}>{title}</Text>
        
        {showProfile && (
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={handleProfilePress}
          >
            <View style={styles.profileIcon}>
              <Text style={styles.profileText}>{getInitials()}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalProfileIcon}>
                    <Text style={styles.modalProfileText}>{getInitials()}</Text>
                  </View>
                  <Text style={styles.modalUserName}>
                    {user?.name || (user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user?.username) || "Uživatel"}
                  </Text>
                  {user?.class && (
                    <Text style={styles.modalUserClass}>{user.class}</Text>
                  )}
                  {user?.role && (
                    <Text style={styles.modalUserClass}>
                      {user.role === 'student' ? 'Student' : user.role === 'učitel' ? 'Učitel' : user.role}
                    </Text>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#fff" />
                  <Text style={styles.logoutButtonText}>Odhlásit se</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Zavřít</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 15,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginLeft: 0,
    paddingLeft: 0,
    textAlign: "center",
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4C8DEF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalProfileIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4C8DEF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalProfileText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  modalUserName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  modalUserClass: {
    fontSize: 16,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#666",
    fontSize: 16,
  },
});

