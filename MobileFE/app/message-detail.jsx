import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import { api } from "./services/api";

// Mock data - fallback
const mockMessageData = {
  _id: "msg-1",
  sender: "Ing. Václav Bohata",
  subject: "Podvodný email",
  date: "20.12.2025",
  content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
};

export default function MessageDetail() {
  const { messageId } = useLocalSearchParams();
  const [message, setMessage] = useState(mockMessageData);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadMessage();
  }, [messageId]);

  const loadMessage = async () => {
    setLoading(true);
    try {
      if (messageId) {
        const data = await api.getMessageDetail(messageId);
        // Backend vrací: { id, title, content, author: { first_name, last_name, gender }, created_at }
        const date = new Date(data.created_at);
        setMessage({
          _id: data.id,
          sender: `${data.author.first_name} ${data.author.last_name}`,
          subject: data.title,
          date: date.toLocaleDateString('cs-CZ'),
          content: data.content,
        });
      }
    } catch (error) {
      console.error("Error loading message:", error);
      // Použijeme mock data při chybě
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4C8DEF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={message.sender} showBack />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Message header */}
        <View style={styles.messageHeader}>
          <Text style={styles.messageSubject}>{message.subject}</Text>
          <Text style={styles.messageDate}>{message.date}</Text>
        </View>

        {/* Message content */}
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>{message.content}</Text>
        </View>
      </ScrollView>
    </View>
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
  messageHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  messageSubject: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  messageDate: {
    fontSize: 14,
    color: "#666",
  },
  messageContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  messageText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
  },
});


