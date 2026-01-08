import { View, Text, StyleSheet, ScrollView, TouchableOpacity, PanResponder } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { api } from "./services/api";
import { useRouter, useFocusEffect } from "expo-router";
import Header from "./components/Header";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock data - v reálné aplikaci by se načítalo z API
const mockMessagesData = [
  {
    _id: "msg-1",
    sender: "Ing. Václav Bohata",
    subject: "Podvodný email",
    preview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    date: "12.12.2025",
    month: "Prosinec 2025",
    read: false,
  },
  {
    _id: "msg-2",
    sender: "Ing. Václavka Bohatová",
    subject: "Podvodný email",
    preview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    date: "1.1.2026",
    month: "Leden 2026",
    read: false,
  },
  {
    _id: "msg-3",
    sender: "Ing. Václav Bohata",
    subject: "Podvodný email",
    preview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    date: "1.1.2026",
    month: "Leden 2026",
    read: true,
  },
];

export default function Messages() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const swipeStartXRef = useRef(0);
  const swipeStartYRef = useRef(0);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    let loadedMessages = [];
    
    try {
      const studentId = user?.studentId;
      if (studentId) {
        const data = await api.getMessages(studentId);
        loadedMessages = data.messages || [];
      } else {
        loadedMessages = [...mockMessagesData];
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      loadedMessages = [...mockMessagesData];
    }
    
    try {
      const readMessages = await AsyncStorage.getItem('readMessages') || '[]';
      const readMessagesArray = JSON.parse(readMessages);
      loadedMessages = loadedMessages.map(msg => 
        readMessagesArray.includes(msg._id) ? { ...msg, read: true } : msg
      );
    } catch (error) {
      console.error("Error loading read messages from storage:", error);
    }
    
    setMessages(loadedMessages);
    setLoading(false);
  }, [user?.studentId]);

  useEffect(() => {
    loadMessages();
  }, [filter, loadMessages]);

  const handleMessagePress = async (messageId) => {
    await markMessageAsRead(messageId);
    router.push({
      pathname: "/message-detail",
      params: { messageId }
    });
  };

  const markMessageAsRead = async (messageId) => {
    try {
      if (user?.studentId) {
        await api.markMessageAsRead(user.studentId, messageId);
      }
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
      
      const readMessages = await AsyncStorage.getItem('readMessages') || '[]';
      const readMessagesArray = JSON.parse(readMessages);
      if (!readMessagesArray.includes(messageId)) {
        readMessagesArray.push(messageId);
        await AsyncStorage.setItem('readMessages', JSON.stringify(readMessagesArray));
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    }
  };

  const swipePanResponderRef = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: (evt) => {
        swipeStartXRef.current = evt.nativeEvent.pageX;
        swipeStartYRef.current = evt.nativeEvent.pageY;
      },
      onPanResponderMove: () => {},
      onPanResponderRelease: (evt) => {
        const deltaX = evt.nativeEvent.pageX - swipeStartXRef.current;
        const deltaY = Math.abs(evt.nativeEvent.pageY - swipeStartYRef.current);
        
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
          if (deltaX < 0) {
            router.push("/rozvrh");
          } else {
            router.push("/znamky");
          }
        }
      },
    })
  );

  useFocusEffect(
    useCallback(() => {
      const updateReadStatus = async () => {
        try {
          const readMessages = await AsyncStorage.getItem('readMessages') || '[]';
          const readMessagesArray = JSON.parse(readMessages);
          
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              readMessagesArray.includes(msg._id) ? { ...msg, read: true } : msg
            )
          );
        } catch (error) {
          console.error("Error updating read status:", error);
        }
      };
      updateReadStatus();
    }, [])
  );

  // Filtrování zpráv
  const filteredMessages = filter === "unread" 
    ? messages.filter(msg => !msg.read)
    : messages;

  const filteredGrouped = filteredMessages.reduce((acc, msg) => {
    const month = msg.month || "Ostatní";
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(msg);
    return acc;
  }, {});

  const panHandlers = swipePanResponderRef.current.panHandlers;

  return (
    <View style={styles.container}>
      <Header title="Zprávy" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Filter buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
            onPress={() => setFilter("all")}
          >
            <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
              Vše
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, styles.filterButtonSecond, filter === "unread" && styles.filterButtonActive]}
            onPress={() => setFilter("unread")}
          >
            <Text style={[styles.filterText, filter === "unread" && styles.filterTextActive]}>
              Nepřečtené
            </Text>
          </TouchableOpacity>
        </View>

        {/* Messages grouped by month */}
        <View style={styles.messagesContainer}>
          {Object.keys(filteredGrouped).map((month) => (
            <View key={month} style={styles.monthSection}>
              <Text style={styles.monthTitle}>{month}</Text>
              {filteredGrouped[month].map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onPress={() => handleMessagePress(message._id)}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


function MessageCard({ message, onPress }) {
  return (
    <TouchableOpacity style={styles.messageCard} onPress={onPress}>
      <View style={styles.profileIcon}>
        <Ionicons name="person" size={20} color="#666" />
      </View>
      <View style={styles.messageInfo}>
        <Text style={styles.senderName}>{message.sender}</Text>
        <Text style={styles.messageSubject}>{message.subject}</Text>
        <Text style={styles.messagePreview} numberOfLines={2}>
          {message.preview}
        </Text>
      </View>
      <View style={styles.messageMeta}>
        <Text style={styles.messageDate}>{message.date}</Text>
        {!message.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  filterButtonSecond: {
    marginLeft: 10,
  },
  filterButtonActive: {
    backgroundColor: "#4C8DEF",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  monthSection: {
    marginBottom: 25,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  messageCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    padding: 15,
    alignItems: "flex-start",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Android shadow
    elevation: 2,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  messageSubject: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  messageMeta: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 40,
  },
  messageDate: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4C8DEF",
    marginTop: 8,
  },
});
