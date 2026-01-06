import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "./components/Header";
import { Ionicons } from "@expo/vector-icons";

// Mock data - v reálné aplikaci by se načítalo z API
const mockLessonData = {
  _id: "a1",
  subject: "Český jazyk a literatura",
  teacher: "Věra Svárovská",
  class: "4.AI",
  group: "4.AI (ANI2)",
  classroom: "060",
  date: "Po 15.12.",
  lessonNumber: 6,
  time: "7:55 - 8:40",
  grade: {
    name: "Maturitní opakování",
    value: "1-",
    weight: 0.0,
  },
  homework: {
    task: "Přepsat zápis",
    dueDate: "12.12.2025 16:00",
  },
  lessonInfo: "-",
  coveredMaterial: "-",
};

export default function LessonDetail() {
  const { lessonId } = useLocalSearchParams();
  const router = useRouter();
  
  // V reálné aplikaci by se načítalo z API podle lessonId
  const lesson = mockLessonData;

  return (
    <View style={styles.container}>
      <Header title={lesson.subject} showBack />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Date and lesson number */}
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>
            {lesson.date} ({lesson.lessonNumber})
          </Text>
        </View>

        {/* Informace */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informace</Text>
          
          <InfoRow label="Vyučující" value={lesson.teacher} />
          <InfoRow label="Třída" value={lesson.class} />
          <InfoRow label="Skupina" value={lesson.group} />
          <InfoRow label="Učebna" value={lesson.classroom} />
        </View>

        {/* Hodnocení */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hodnocení</Text>
          
          <View style={styles.gradeCard}>
            <View style={styles.gradeBox}>
              <Text style={styles.gradeValue}>{lesson.grade.value}</Text>
            </View>
            <View style={styles.gradeInfo}>
              <Text style={styles.gradeName}>{lesson.grade.name}</Text>
              <Text style={styles.gradeWeight}>Váha: {lesson.grade.weight}</Text>
            </View>
          </View>
        </View>

        {/* Domácí úkoly */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Domácí úkoly</Text>
          
          <View style={styles.homeworkCard}>
            <Text style={styles.homeworkTask}>Úkol: {lesson.homework.task}</Text>
            <Text style={styles.homeworkDate}>
              Datum odevzdání: {lesson.homework.dueDate}
            </Text>
          </View>
        </View>

        {/* Informace k výuce */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informace k výuce</Text>
          <Text style={styles.emptyText}>{lesson.lessonInfo}</Text>
        </View>

        {/* Probrané učivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Probrané učivo</Text>
          <Text style={styles.emptyText}>{lesson.coveredMaterial}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  dateSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dateText: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  infoLabel: {
    fontSize: 15,
    color: "#666",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  gradeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
  },
  gradeBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#C8E6C9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  gradeValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  gradeInfo: {
    flex: 1,
  },
  gradeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  gradeWeight: {
    fontSize: 14,
    color: "#666",
  },
  homeworkCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
  },
  homeworkTask: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  homeworkDate: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    fontStyle: "italic",
  },
});

