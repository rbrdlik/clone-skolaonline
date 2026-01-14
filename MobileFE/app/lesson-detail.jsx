import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";
import { api } from "./services/api";
import { getLessonDetail } from "./data/lessons";

// Mock data - fallback
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
  scheduleChangeType: "normal",
  scheduleChangeNote: null,
};

export default function LessonDetail() {
  const { lessonId, date, hour } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(mockLessonData);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadLesson();
  }, [lessonId, date, hour, user?._id]);

  const loadLesson = async () => {
    setLoading(true);
    try {
      // Pokud máme date a hour z parametrů, použijeme API
      if (user?._id && date && hour) {
        const data = await api.getLessonDetail(user._id, date, hour);
        // Backend vrací: { date, hour, subject, teacher: { first_name, last_name }, class, group, room, type, grade, note }
        const dayNames = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
        const lessonDate = new Date(data.date);
        const formattedDate = `${dayNames[lessonDate.getDay()]} ${lessonDate.getDate()}.${lessonDate.getMonth() + 1}.`;
        
        const times = {
          1: "7:55 - 8:40",
          2: "8:45 - 9:30",
          3: "9:40 - 10:25",
          4: "10:30 - 11:15",
          5: "11:25 - 12:10",
          6: "12:20 - 13:05",
          7: "13:15 - 14:00",
          8: "14:00 - 14:45",
          9: "14:55 - 15:40",
        };
        
        setLesson({
          _id: lessonId || `lesson-${date}-${hour}`,
          subject: data.subject,
          teacher: data.teacher ? `${data.teacher.first_name} ${data.teacher.last_name}` : "Neznámý učitel",
          class: data.class || "",
          group: data.group || "",
          classroom: data.room || "",
          date: formattedDate,
          lessonNumber: data.hour,
          time: times[data.hour] || "7:55 - 8:40",
          grade: data.grade ? {
            name: data.grade.description || "Známka",
            value: data.grade.value === 0 ? "NH" : data.grade.value.toString(),
            weight: data.grade.weight || 0,
          } : null,
          scheduleChangeType: data.type || "normal", // Typ změny: normal, cancel, change, room_change, note
          scheduleChangeNote: data.note || null, // Poznámka ze schedule change
        });
      } else if (lessonId) {
        // Fallback na mock data pomocí lessonId
        const mockLesson = getLessonDetail(lessonId);
        setLesson(mockLesson);
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      // Fallback na mock data
      if (lessonId) {
        const mockLesson = getLessonDetail(lessonId);
        setLesson(mockLesson);
      }
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

        {/* Změna rozvrhu */}
        {(lesson.scheduleChangeType && lesson.scheduleChangeType !== "normal") || lesson.scheduleChangeNote ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Změna rozvrhu</Text>
            
            <View style={styles.changeCard}>
              {lesson.scheduleChangeType === "cancel" && (
                <View style={styles.changeBadge}>
                  <Text style={styles.changeBadgeText}>Hodina odpadla</Text>
                </View>
              )}
              {lesson.scheduleChangeType === "change" && (
                <View style={[styles.changeBadge, styles.changeBadgeSubstitution]}>
                  <Text style={styles.changeBadgeText}>Suplování</Text>
                </View>
              )}
              {lesson.scheduleChangeType === "room_change" && (
                <View style={[styles.changeBadge, styles.changeBadgeRoom]}>
                  <Text style={styles.changeBadgeText}>Změna učebny</Text>
                </View>
              )}
              {(lesson.scheduleChangeType === "note" || lesson.scheduleChangeNote) && (
                <View style={[styles.changeBadge, styles.changeBadgeNote]}>
                  <Text style={styles.changeBadgeText}>Poznámka</Text>
                </View>
              )}
              
              {lesson.scheduleChangeNote && (
                <Text style={styles.changeNote}>{lesson.scheduleChangeNote}</Text>
              )}
            </View>
          </View>
        ) : null}

        {/* Hodnocení - zobrazí se pouze pokud bylo skutečně zadáno hodnocení */}
        {lesson.grade && lesson.grade.value !== undefined && lesson.grade.value !== null ? (
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
        ) : null}
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
  changeCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
  },
  changeBadge: {
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  changeBadgeSubstitution: {
    backgroundColor: "#FFF4E5",
  },
  changeBadgeRoom: {
    backgroundColor: "#E5F5E5",
  },
  changeBadgeNote: {
    backgroundColor: "#E5F0FF",
  },
  changeBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  changeNote: {
    fontSize: 15,
    color: "#000",
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    fontStyle: "italic",
  },
});

