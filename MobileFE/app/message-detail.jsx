import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "./components/Header";
import { Ionicons } from "@expo/vector-icons";

const mockMessageData = {
  _id: "msg-1",
  sender: "Ing. Václav Bohata",
  subject: "Podvodný email",
  date: "20.12.2025",
  content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
};

export default function MessageDetail() {
  const { messageId } = useLocalSearchParams();
  
  const message = mockMessageData;

  return (
    <View style={styles.container}>
      <Header title={message.sender} showBack />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageSubject}>{message.subject}</Text>
          <Text style={styles.messageDate}>{message.date}</Text>
        </View>

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


